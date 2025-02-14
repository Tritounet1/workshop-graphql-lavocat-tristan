from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
import strawberry
from typing import List

if __name__ == "__main__":
    # Define the Comment model
    @strawberry.type
    class Comment:
        id: int
        content: str
        author: str

    # Define the Post model with a list of comments
    @strawberry.type
    class Post:
        id: int
        title: str
        content: str
        comments: List[Comment]

    # Define the User model with a list of posts
    @strawberry.type
    class User:
        id: int
        name: str
        email: str
        posts: List[Post]

    # Sample data: create some users with posts and comments
    def get_sample_data():
        comments1 = [Comment(id=1, content="Great post!", author="Jane"), Comment(id=2, content="Very informative.", author="Mark")]
        comments2 = [Comment(id=3, content="Nice read.", author="Alice"), Comment(id=4, content="Loved it!", author="Bob")]

        posts_user1 = [Post(id=1, title="GraphQL vs REST", content="An in-depth comparison", comments=comments1)]
        posts_user2 = [Post(id=2, title="FastAPI with GraphQL", content="How to integrate GraphQL with FastAPI", comments=comments2)]

        users = [
            User(id=1, name="John Doe", email="john.doe@example.com", posts=posts_user1),
            User(id=2, name="Jane Smith", email="jane.smith@example.com", posts=posts_user2)
        ]

        return users

    # Define a query to get users and a single user by ID
    @strawberry.type
    class Query:
        @strawberry.field
        def user(self, id: int) -> User:
            # Retrieve a user by ID from the sample data
            users = get_sample_data()
            for user in users:
                if user.id == id:
                    return user
            raise ValueError(f"User with id {id} not found")

        @strawberry.field
        def users(self) -> List[User]:
            # Return all users
            return get_sample_data()

    # Create the schema
    schema = strawberry.Schema(query=Query)

    # Initialize FastAPI and add the GraphQL route
    app = FastAPI()
    graphql_app = GraphQLRouter(schema)
    app.include_router(graphql_app, prefix="/graphql")

    # Run the app using: `uvicorn filename:app --reload`
