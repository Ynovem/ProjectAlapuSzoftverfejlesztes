from schemas import Layout, Rule
from crud import layout as crudLayout
from solvers.common.common import Common

import json
import copy

DEFAULT_CONSTRAINT = 150


class MinimumDegree:
    def __init__(self, rule: Rule):
        self.constraint = rule.limit
        self.layoutService = crudLayout

    def solve(self, layout: Layout):
        seats = json.loads(layout.coords)
        # num is same as index of array
        Common.add_num(seats)
        # create list of conflicting seats compared to the current one
        Common.add_neighbors(seats, Common.get_edges(seats, self.constraint))

        tmp = list(map(lambda x: copy.deepcopy(x), seats))
        # temporary list of forbidden seats
        forbidden = list()
        # temporary list of free seats
        allowed = list()

        min_degree_num = min(map(lambda x: len(x["neighbors"]), tmp))
        have_to_delete = list()
        # core of algorithm
        i = 0
        while len(list(filter(lambda x: x is not None, tmp))) > 0:
            for current in tmp:
                if current is not None and self.len_plus(current) == min_degree_num:
                    allowed.append(current["num"])
                    have_to_delete.append(current["num"])
                    forbidden.extend(current["neighbors"])
                    have_to_delete.extend(current["neighbors"])
                    for neighbor_num in current["neighbors"]:
                        for meta_neighbor_num in tmp[neighbor_num]["neighbors"]:
                            if meta_neighbor_num not in have_to_delete:
                                if neighbor_num in tmp[meta_neighbor_num]["neighbors"]:
                                    tmp[meta_neighbor_num]["neighbors"].remove(neighbor_num)
                        tmp[neighbor_num] = None
                    tmp[current["num"]] = None
                    have_to_delete.clear()
                    min_degree_num = min(map(lambda x: self.len_plus(x), tmp))
                    i = i + 1
                    break
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

    def len_plus(self, a):
        if a is None:
            return 1000
        else:
            return len(a["neighbors"])
