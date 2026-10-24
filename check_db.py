import sqlite3
for p in ['backend/database.db', 'database.db']:
    try:
        c=sqlite3.connect(p)
        cur=c.execute("SELECT name FROM sqlite_master WHERE type='table'")
        print(p, [r[0] for r in cur.fetchall()][:12])
        c.close()
    except Exception as e:
        print(p, e)
