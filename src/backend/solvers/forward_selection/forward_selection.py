from schemas import Layout, Rule
from crud import layout as crudLayout
from solvers.common.common import Common

import json
import networkx as nx
from itertools import groupby

DEFAULT_CONSTRAINT = 150


class ForwardSelection:
    def __init__(self, rule: Rule):
        self.constraint = rule.limit
        self.layoutService = crudLayout

    def solve(self, layout: Layout):
        seats = json.loads(layout.coords)
        Common.add_num(seats)
        edges = Common.get_edges(seats, self.constraint)

        # create base graph
        graph = nx.Graph()
        graph.add_edges_from(edges)

        # create graph list, which contains smaller and smaller subgraph
        graphs = list()

        min_search_size = 30
        lower_bound = int(len(seats) / 2)
        min_search_size = min(lower_bound, min_search_size)

        while graph is not None and len(graph.nodes) >= min_search_size:
            graphs.insert(0, graph.copy())
            graph.remove_node(max(graph.nodes))

        # run maximal_independent_set on elements of array
        solutions = list()
        for g in graphs:
            if len(g.nodes) == min_search_size:
                for n in g.nodes:
                    solutions.append([n])
            else:
                tmp = list()
                current_node = max(g.nodes)
                if current_node < lower_bound / 5:
                    solutions.append([current_node])
                for s in solutions:
                    tmp.append(nx.maximal_independent_set(g, s))

                solutions.extend(tmp)
                solutions = [k for k, v in groupby(sorted(tmp))]

        allowed = self.get_longest(solutions)

        # set busy
        for seat in seats:
            if seat["num"] in allowed:
                seat["busy"] = True
            else:
                seat["busy"] = False
            del seat["num"]
        layout.coords = json.dumps(seats)
        return layout

    def get_longest(self, lst):
        max_idx = 0
        for i in range(1, len(lst)):
            if len(lst[max_idx]) < len(lst[i]):
                max_idx = i
        if len(lst) <= max_idx:
            return {}
        return lst[max_idx]
