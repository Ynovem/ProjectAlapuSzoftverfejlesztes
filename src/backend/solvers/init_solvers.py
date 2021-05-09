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
        )
    ]
    if len(solvers) == 0:
        for solver in default_solvers:
            solver_saved = crud.solver.create(db, obj_in=solver)  # noqa: F841
            print(f'Solver added: [{solver_saved.id}] {solver_saved.name}')