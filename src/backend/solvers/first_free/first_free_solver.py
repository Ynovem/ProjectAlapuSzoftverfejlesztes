from schemas import Layout
from crud import layout as crudLayout

class FirstFree:
    def __init__(self):
        self.layoutService = crudLayout

    def solve(self, layout: Layout):
        return []
