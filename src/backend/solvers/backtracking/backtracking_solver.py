import json
import copy

from schemas import Layout


class Backtracking:
    def __init__(self):
        self.limit = 150
        pass

    def solve(self, layout: Layout):
        vertices, edges = self.__prepare_graph(layout)
        return []

    def __generate_graph(self, layout: Layout):
        coords = json.loads(layout.coords)

    def __prepare_graph(self, layout: Layout) -> dict:
        if layout:
            pass
        edges = {}
        vertices = {}
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

        maximal_independent_set = doit(
            initial_graph=graph,
            initial_independent_set=independent_set,
            initial_remaining_vertices=vertices,
        )

        print('\n' * 5)
        print('RESULT')
        print(f'edges: {edges}')
        print(f'graph: {graph}')
        print(f'maximal_independent_set: {maximal_independent_set}')

    def doit(initial_graph: dict, initial_independent_set: set, initial_remaining_vertices: set) -> set:
        maximal_independent_set = initial_independent_set

        if len(initial_remaining_vertices) == 0:
            return maximal_independent_set

        for vertex in initial_remaining_vertices:
            # print(f'\nVertex {vertex} from {initial_remaining_vertices}')
            # print(f'Set {maximal_independent_set} <> {initial_independent_set}')

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

            maximal_independent_set_candidate = doit(
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

