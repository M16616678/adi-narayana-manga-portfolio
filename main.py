from fastapi import FastAPI, HTTPException
from pydentic import BaseModel 


class Item(BaseModel):
   text : str = None
   is_done : bool = False


app = FastAPI()


items: list[str] = []

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items

@app.get("/items")
def lis_items(limit: int = 10) -> list[str]:
    return items[:limit]  # type: ignore

@app.get("/items/{item_id}")
def get_item(item_id: int) -> str:
    if item_id >= len(items):
        raise HTTPException(status_code=404, detail="Item " + str(item_id) + " not found")
    else:
        return items[item_id]