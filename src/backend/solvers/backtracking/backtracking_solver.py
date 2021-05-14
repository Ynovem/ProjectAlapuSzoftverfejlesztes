import json
import copy

from schemas import Rule
from schemas import Layout

from solvers.common.common import Common


class Backtracking:
    def __init__(self, rule: Rule):
        self.rule = rule

    def solve(self, layout: Layout):
        coords = json.loads(layout.coords)
        vertices = set(range(len(coords)))
        edges = Common.get_edges(coords, self.rule.limit)
        maximal_independent_set = self.backtracking(edges, vertices)

        for v in maximal_independent_set:
            coords[v]['busy'] =  True

        layout.coords = json.dumps(coords)
        # vertices, edges = self.__prepare_graph(layout)
        # vertices, edges = self.__generate_graph(layout)
        return layout

    # def __generate_graph(self, layout: Layout):
    #     limit = self.rule.limit
    #     #
    #     # edges = {}
    #     # for v1 in range(len(vertices)):
    #     #     for v2 in range(len(vertices)):
    #     #         if v1 == v2:
    #     #             continue
    #     #
    #     # print(f'vertices: {vertices}')
    #     # graph = dict()
    #     #
    #     # return graph
    #
    def __prepare_graph(self, edges, vertices) -> dict:

        print(f'V: {vertices}')
        print(f'E: {edges}')

        graph = dict()
        for v in vertices:
            if v not in graph:
                graph[v] = set()

        for (v1, v2) in edges:
            # if v1 not in graph or v2 not in graph:
            #     pass # TODO error handling
            graph[v1].add(v2)
            graph[v2].add(v1)

        return graph

    def backtracking(self, edges, vertices):
        graph = self.__prepare_graph(edges, vertices)
        independent_set = set()

        # print(f'BackTracking')
        # print(f'\tGraph:')
        # for v, e in graph.items():
        #     print(f'\t\t{v} -> {e}')
        # print(f'\tindependent set: {independent_set}')
        # print(f'\tvertices, {vertices}')

        maximal_independent_set = self.doit(
            initial_graph=graph,
            initial_independent_set=independent_set,
            initial_remaining_vertices=vertices,
        )

        # print('\n' * 5)
        # print('RESULT')
        # print(f'edges: {edges}')
        # print(f'graph: {graph}')
        # print(f'maximal_independent_set: {maximal_independent_set}')
        return maximal_independent_set

    def doit(self, initial_graph: dict, initial_independent_set: set, initial_remaining_vertices: set) -> set:
        maximal_independent_set = initial_independent_set

        if len(initial_remaining_vertices) == 0:
            print(f'')
            return maximal_independent_set

        for vertex in initial_remaining_vertices:
            if len(initial_independent_set) == 0:
                print(f'V: {vertex}: ', end='')
            else:
                print(f'.', end='')
            independent_set = copy.deepcopy(initial_independent_set)
            remaining_vertices = copy.deepcopy(initial_remaining_vertices)
            graph = copy.deepcopy(initial_graph)

            if vertex in remaining_vertices:
                independent_set.add(vertex)
                remaining_vertices.discard(vertex)

            if vertex in graph:
                del graph[vertex]
            for v in list(graph):
                if vertex in graph[v]:
                    if v in graph:
                        del graph[v]
                        remaining_vertices.discard(v)
                else:
                    graph[v].discard(vertex)

            maximal_independent_set_candidate = self.doit(
                initial_graph=graph,
                initial_independent_set=independent_set,
                initial_remaining_vertices=remaining_vertices,
            )

            if len(maximal_independent_set) < len(maximal_independent_set_candidate):
                maximal_independent_set = maximal_independent_set_candidate

        return maximal_independent_set
        # edge = list(graph.keys())[0]
        # del graph[edge]
        # for edge, vertex in graph.items():
        #     vertex.discard(edge)
        #
        # return independent_set

