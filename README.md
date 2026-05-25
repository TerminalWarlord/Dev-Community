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
| GET    | `/user/profile/:userId`                    |         Get details of a user          |
| GET    | `/user/profile/:userId/skills`             |  Get the list of the skills of a user  |
| GET    | `/user/profile/:userId/experiences`        |  Get the list of the skills of a user  |
| GET    | `/user/profile/:userId/post/:postSlug`     |            Get a user post             |
| GET    | `/user/profile/:userId/post/all`           |           Get all user posts           |
| GET    | `/user/all`                                |             Get all users              |
| PATCH  | `/user/change-password`                    |          Change user password          |
| GET    | `/user/skill/all`                          |             Get all skills             |
| POST   | `/user/skill/add`                          |            Add a new skill             |
| DELETE | `/user/skill/:userSkillId/remove`          |           Remove a new skill           |
| POST   | `/user/experience/add`                     |          Add a new experience          |
| PATCH  | `/user/experience/:experienceId/update`    |          Update an experience          |
| POST   | `/user/experience/:experienceId/remove`    |          Add a new experience          |
| POST   | `/user/invitation/accept/:communityRoleId` | Accept an invitation to be a moderator |
| POST   | `/user/invitation/reject/:communityRoleId` | Reject an invitation to be a moderator |


## Community Endpoints
| Method | Endpoint                                               |                  Description                  |
| ------ | ------------------------------------------------------ | :-------------------------------------------: |
| GET    | `/community/all`                                       |          Get list of all communties           |
| POST   | `/community/create`                                    |              Create a community               |
| PATCH  | `/community/:communityId/update`                       |    `[ADMIN]`  Update community information    |
| DELETE | `/community/:communityId/delete`                       |        `[ADMIN]`   Delete a community         |
| POST   | `/community/:communityId/join`                         |          Join a community as a user           |
| POST   | `/community/:communityId/invite/:userId`               |   `[ADMIN]` Invite a user to be a moderator   |
| POST   | `/community/:communityId/invite/accept/:invitationId`  |     Accept invitation to join a community     |
| POST   | `/community/:communityId/invite/discard/:invitationId` |    Discard invitation to join a community     |
| GET    | `/community/:communityId/member/all`                   |    Get a list of members of the community     |
| DELETE | `/community/:communityId/member/:userId/ban`           | `[ADMIN/MOD]` Ban a member from the community |

## Post Endpoints
| Method | Endpoint                 |         Description         |
| ------ | ------------------------ | :-------------------------: |
| POST   | `/post/create`           |        Create a post        |
| GET    | `/post/all`              |        Get all posts        |
| GET    | `/post/:postSlug`        |         Get a  post         |
| PATCH  | `/post/:postSlug/update` |       Update a  post        |
| POST   | `/post/:postSlug/vote`   | `upvote`/`downvote` a  post |
| DELETE | `/post/:postSlug/delete` | `[ADMIN/MOD]` delete a post |

## Comments Endpoints

| Method | Endpoint                      |                       Description                       |
| ------ | ----------------------------- | :-----------------------------------------------------: |
| GET    | `/post/:postSlug/comment/all` |                 Get comments of a post                  |
| POST   | `/post/:postSlug/comment/add` |                 Add a comment to a post                 |
| GET    | `/comment/:commentId`         |                      Get a comment                      |
| POST   | `/comment/:commentId/vote`    |                     Vote a comment                      |
| PATCH  | `/comment/:commentId/update`  |               Update a comment of a post                |
| DELETE | `/comment/:commentId/delete`  | `[ADMIN/MOD/User(itself)]` Delete a comment from a post |


## Superadmin Endpoints

| Method | Endpoint                           |    Description     |
| ------ | ---------------------------------- | :----------------: |
| DELETE | `/admin/user/:userId/delete`       |   Delete a user    |
| DELETE | `/admin/post/:postSlug/delete`     |   Delete a post    |
| DELETE | `/admin/comment/:commentId/delete` |  Delete a comment  |
| DELETE | `/admin/user/:community/delete`    | Delete a community |




