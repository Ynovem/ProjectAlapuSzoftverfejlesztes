import numpy as np


class Common:
    @staticmethod
    def get_edges(seats, constraint):
        ret = list()
        i = 0
        while i < len(seats):
            j = i + 1
            while j < len(seats):
                if np.linalg.norm(np.array((seats[i]["x"], seats[i]["y"])) - np.array((seats[j]["x"], seats[j]["y"]))) <= constraint:
                    ret.append((i, j))
                j = j + 1
            i = i + 1
        return ret

    @staticmethod
    def add_num(seats):
        for i in range(len(seats)):
            seats[i]["num"] = i

    @staticmethod
    def add_neighbors(seats, edges):
        for seat in seats:
            seat["neighbors"] = list()
        for edge in edges:
            if edge[1] not in seats[edge[0]]["neighbors"]:
                seats[edge[0]]["neighbors"].append(edge[1])
            if edge[0] not in seats[edge[1]]["neighbors"]:
                seats[edge[1]]["neighbors"].append(edge[0])

    @staticmethod
    def print_seats(seats):
        for seat in seats:
            print(seat)
