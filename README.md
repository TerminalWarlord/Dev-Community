# Dev Community


## Tech Stack
- Runtime: Node
- Framework: Nest.JS
- Database: MongoDB
- ODM: Mongoose

### Data Model Diagram
![Data model diagram](/docs/data_model_diagram.png)

For better view: https://dbdiagram.io/d/Dev-Community-6a02b9f454a51d93d3fe1826



### Endpoints

## Auth Endpoints
| Method | Endpoint       |    Description    |
| ------ | -------------- | :---------------: |
| POST   | `/auth/signup` | Create an account |
| POST   | `/auth/login`  |  Login as a user  |


## User Endpoints
| Method | Endpoint                                   |              Description               |
| ------ | ------------------------------------------ | :------------------------------------: |
| PATCH  | `/user/change-password`                    |          Change user password          |
| POST   | `/user/skill/add`                          |            Add a new skill             |
| DELETE | `/user/skill/remove`                       |           Remove a new skill           |
| POST   | `/user/experience/add`                     |          Add a new experience          |
| PATCH  | `/user/experience/update`                  |          Update an experience          |
| POST   | `/user/experience/remove`                  |          Add a new experience          |
| POST   | `/user/invitation/accept/:communityRoleId` | Accept an invitation to be a moderator |
| POST   | `/user/invitation/reject/:communityRoleId` | Reject an invitation to be a moderator |


## Community Endpoints
| Method | Endpoint                                      |                  Description                   |
| ------ | --------------------------------------------- | :--------------------------------------------: |
| POST   | `/community/create`                           |               Create a community               |
| PATCH  | `/community/:communityId/update`              |          Update community information          |
| DELETE | `/community/:communityId/delete`              |               Delete a community               |
| POST   | `/community/:communityId/post/create`         |            Create a community post             |
| PATCH  | `/community/:communityId/post/:postId/update` |            Update a community post             |
| POST   | `/community/:communityId/post/:postId/vote`   |      `upvote`/`downvote` a community post      |
| POST   | `/community/:communityId/post/:postId/vote`   |             Vote a community post              |
| DELETE | `/community/:communityId/post/:postId/delete` | `[ADMIN/MOD]` delete a post from the community |
| DELETE | `/community/:communityId/user/:userId/ban`    |  `[ADMIN/MOD]` Ban a user from the community   |
| POST   | `/community/:communityId/user/:userId/invite` |  `[ADMIN/MOD]` Ban a user from the community   |






