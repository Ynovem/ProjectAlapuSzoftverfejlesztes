from schemas import Layout
from crud import layout as crudLayout

import json
import numpy as np

DEFAULT_CONSTRAINT = 150

class FirstFree:
    def __init__(self):
        self.layoutService = crudLayout

    def solve(self, layout: Layout):
        seats = json.loads(layout.coords)
        self.add_num(seats) # same as index in array
        self.add_neighbors(seats, self.get_edges(seats)) # list of conflicting seats compared to the current one

        forbidden = list() # temporary list of forbidden seats
        allowed = list()# temporary list of free seats

        for current in seats: # core of algorithm
            if current["num"] not in forbidden:
                allowed.append(current["num"])
                forbidden.extend(current["neighbors"])

        for seat in seats: # set busy
            if seat["num"] in allowed:
                seat["busy"] = True
            else:
                seat["busy"] = False
            del seat["neighbors"] # delete unnecessary properties
            del seat["num"] # delete unnecessary properties
        layout.coords = json.dumps(seats)
        return layout

    def print_seats(self, seats):
        for seat in seats:
            print(seat)

    def add_num(self, seats):
        for i in range(len(seats)):
            seats[i]["num"] = i

    def get_edges(self, seats):
        ret = list()
        i = 0
        while i < len(seats):
            j = i + 1
            while j < len(seats):
                if np.linalg.norm( np.array( (seats[i]["x"], seats[i]["y"]) ) - np.array( (seats[j]["x"], seats[j]["y"]) ) ) <= DEFAULT_CONSTRAINT:
                    ret.append((i,j))
                j = j + 1
            i = i + 1
        return ret

    def add_neighbors(self, seats, edges):
        for seat in seats:
            seat["neighbors"] = list()
        for edge in edges:
            if edge[1] not in seats[edge[0]]["neighbors"]:
                seats[edge[0]]["neighbors"].append(edge[1])
            if edge[0] not in seats[edge[1]]["neighbors"]:
                seats[edge[1]]["neighbors"].append(edge[0])
