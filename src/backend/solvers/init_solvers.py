import crud
import schemas
from db.database import SessionLocal


def init_db() -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    solvers = crud.solver.get_multi(db)
    default_solvers: [schemas.Solver] = [
        schemas.Solver(
            name="Backtracking",
            description="Backtracking algorithm, very resource intensive but can guarantee the optimal solution",
        ),
        schemas.Solver(
            name="First Free",
            description="Simple greedy algorithm, which runs in linear time.",
        ),
        schemas.Solver(
            name="Maximal Independent Set",
            description="Greedy algorithm from networkx python library, not solve maximum independent set problem.",
        ),
        schemas.Solver(
            name="Minimum Degree",
            description="Simple greedy algorithm, which runs in linear time.",
        )

    ]
    if len(solvers) == 0:
        for solver in default_solvers:
            solver_saved = crud.solver.create(db, obj_in=solver)  # noqa: F841
            print(f'Solver added: [{solver_saved.id}] {solver_saved.name}')
