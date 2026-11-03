#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SmartPiggy Cloud - Servidor de Base de Datos Sincronizada Multi-Dispositivo (Zero-Config Cloud + CRDT G-Set)
Sirve la aplicación PWA y expone el endpoint REST `/api/cloud/<family_code>` para sincronizar en tiempo real
teléfonos de padres y tablets/PCs de hijos usando unión de conjuntos CRDT G-Set libre de conflictos.
"""

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

PORT = int(os.environ.get("PORT", "8090"))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "cloud_db.json")


def load_cloud_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_cloud_db(db_data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db_data, f, ensure_ascii=False, indent=2)


def merge_collection(local_arr, remote_arr, immutable=False):
    by_id = {}
    for item in (local_arr or []):
        if isinstance(item, dict) and item.get("id"):
            by_id[item["id"]] = item
    for r_item in (remote_arr or []):
        if not isinstance(r_item, dict) or not r_item.get("id"):
            continue
        item_id = r_item["id"]
        if item_id not in by_id:
            by_id[item_id] = r_item
        elif not immutable:
            loc_t = str(by_id[item_id].get("updatedAt") or by_id[item_id].get("createdAt") or "")
            rem_t = str(r_item.get("updatedAt") or r_item.get("createdAt") or "")
            if rem_t >= loc_t:
                by_id[item_id] = r_item
    return list(by_id.values())


def merge_crdt_state(existing_state, incoming_state):
    if not existing_state or not existing_state.get("family"):
        return incoming_state
    if not incoming_state or not incoming_state.get("family"):
        return existing_state

    ex_fam = existing_state.get("family", {})
    in_fam = incoming_state.get("family", {})
    fam = in_fam if str(in_fam.get("updatedAt", "")) >= str(ex_fam.get("updatedAt", "")) else ex_fam

    return {
        "family": fam,
        "members": merge_collection(existing_state.get("members"), incoming_state.get("members"), False),
        "catalogs": merge_collection(existing_state.get("catalogs"), incoming_state.get("catalogs"), False),
        "recurringRules": merge_collection(existing_state.get("recurringRules"), incoming_state.get("recurringRules"), False),
        "loans": merge_collection(existing_state.get("loans"), incoming_state.get("loans"), False),
        "investments": merge_collection(existing_state.get("investments"), incoming_state.get("investments"), False),
        "childRequests": merge_collection(existing_state.get("childRequests"), incoming_state.get("childRequests"), False),
        "ledgerEvents": merge_collection(existing_state.get("ledgerEvents"), incoming_state.get("ledgerEvents"), True),
        "lastSyncedAt": incoming_state.get("lastSyncedAt") or existing_state.get("lastSyncedAt")
    }


class SmartPiggyCloudHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/cloud/"):
            family_code = unquote(self.path.split("/api/cloud/", 1)[1].split("?")[0]).strip().upper()
            db = load_cloud_db()
            payload = db.get(family_code, {})
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/cloud/"):
            family_code = unquote(self.path.split("/api/cloud/", 1)[1].split("?")[0]).strip().upper()
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            try:
                incoming = json.loads(raw_body)
            except Exception:
                incoming = {}

            db = load_cloud_db()
            merged = merge_crdt_state(db.get(family_code), incoming)
            db[family_code] = merged
            save_cloud_db(db)

            body = json.dumps(merged, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    print(f"SmartPiggy Cloud Server ejecutándose en http://localhost:{PORT}")
    server = ThreadingHTTPServer(("0.0.0.0", PORT), SmartPiggyCloudHandler)
    server.serve_forever()
