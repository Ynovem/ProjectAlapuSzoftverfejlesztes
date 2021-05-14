from schemas import Layout
from crud import layout as crudLayout
from solvers.common.common import Common

import json

DEFAULT_CONSTRAINT = 150


class FirstFree:
    def __init__(self):
        self.layoutService = crudLayout

    def solve(self, layout: Layout):
        seats = json.loads(layout.coords)
        # num is same as index of array
        Common.add_num(seats)
        # create list of conflicting seats compared to the current one
        Common.add_neighbors(seats, Common.get_edges(seats, DEFAULT_CONSTRAINT))
        # temporary list of forbidden seats
        forbidden = list()
        # temporary list of free seats
        allowed = list()
        # core of algorithm
        for current in seats:
            if current["num"] not in forbidden:
                allowed.append(current["num"])
                forbidden.extend(current["neighbors"])
        # set busy
        for seat in seats:
            if seat["num"] in allowed:
                seat["busy"] = True
            else:
                seat["busy"] = False
            # delete unnecessary properties
            del seat["neighbors"]
            del seat["num"]
        layout.coords = json.dumps(seats)
        return layout
