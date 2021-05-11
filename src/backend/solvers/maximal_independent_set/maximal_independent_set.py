from schemas import Layout
from crud import layout as crudLayout
from solvers.common.common import Common

import json
import networkx as nx

DEFAULT_CONSTRAINT = 150


class MaximalIndependentSet:
    def __init__(self):
        self.layoutService = crudLayout

    def solve(self, layout: Layout):
        seats = json.loads(layout.coords)
        Common.add_num(seats)
        edges = Common.get_edges(seats, DEFAULT_CONSTRAINT)
        graph = nx.Graph()
        graph.add_edges_from(edges)
        allowed = nx.maximal_independent_set(graph)
        # set busy
        for seat in seats:
            if seat["num"] in allowed:
                seat["busy"] = True
            else:
                seat["busy"] = False
            del seat["num"]
        layout.coords = json.dumps(seats)
        return layout
