/**
 * @swagger
 * {
 *   "/api/v1/registrations": {
 *     "get": {
 *       "tags": [
 *         "Registrations"
 *       ],
 *       "summary": "List registrations",
 *       "description": "Members receive only their own records; admins receive all. Includes historical registrations; sorted by creation time.",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean",
 *                     "example": true
 *                   },
 *                   "data": {
 *                     "type": "array",
 *                     "items": {
 *                       "$ref": "#/components/schemas/Registration"
 *                     }
 *                   },
 *                   "count": {
 *                     "type": "integer"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "400": {
 *           "$ref": "#/components/responses/Error400"
 *         },
 *         "401": {
 *           "$ref": "#/components/responses/Error401"
 *         },
 *         "403": {
 *           "$ref": "#/components/responses/Error403"
 *         },
 *         "404": {
 *           "$ref": "#/components/responses/Error404"
 *         },
 *         "409": {
 *           "$ref": "#/components/responses/Error409"
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       }
 *     },
 *     "post": {
 *       "tags": [
 *         "Registrations"
 *       ],
 *       "summary": "Create registration",
 *       "description": "Member only; owner comes from JWT. Workshop must be active and today or later in UTC, with a free seat. One registration per member per workshop and at most three active registrations per member. Active means workshop is not deleted and workshopDate is today or later.",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "responses": {
 *         "201": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean",
 *                     "example": true
 *                   },
 *                   "data": {
 *                     "$ref": "#/components/schemas/Registration"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "400": {
 *           "$ref": "#/components/responses/Error400"
 *         },
 *         "401": {
 *           "$ref": "#/components/responses/Error401"
 *         },
 *         "403": {
 *           "$ref": "#/components/responses/Error403"
 *         },
 *         "404": {
 *           "$ref": "#/components/responses/Error404"
 *         },
 *         "409": {
 *           "$ref": "#/components/responses/Error409"
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       },
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/RegistrationInput"
 *             }
 *           }
 *         }
 *       }
 *     }
 *   },
 *   "/api/v1/registrations/{id}": {
 *     "parameters": [
 *       {
 *         "$ref": "#/components/parameters/ResourceId"
 *       }
 *     ],
 *     "get": {
 *       "tags": [
 *         "Registrations"
 *       ],
 *       "summary": "Get registration",
 *       "description": "Owner or admin only. Includes workshop and user details, including soft-deleted workshop history.",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean",
 *                     "example": true
 *                   },
 *                   "data": {
 *                     "$ref": "#/components/schemas/Registration"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "400": {
 *           "$ref": "#/components/responses/Error400"
 *         },
 *         "401": {
 *           "$ref": "#/components/responses/Error401"
 *         },
 *         "403": {
 *           "$ref": "#/components/responses/Error403"
 *         },
 *         "404": {
 *           "$ref": "#/components/responses/Error404"
 *         },
 *         "409": {
 *           "$ref": "#/components/responses/Error409"
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       }
 *     },
 *     "put": {
 *       "tags": [
 *         "Registrations"
 *       ],
 *       "summary": "Update registration",
 *       "description": "Owner or admin only. Move a registration to another workshop. Rechecks date, duplicate, capacity and active limit for the original owner, excluding the record being edited. Ownership cannot change.",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean",
 *                     "example": true
 *                   },
 *                   "data": {
 *                     "$ref": "#/components/schemas/Registration"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "400": {
 *           "$ref": "#/components/responses/Error400"
 *         },
 *         "401": {
 *           "$ref": "#/components/responses/Error401"
 *         },
 *         "403": {
 *           "$ref": "#/components/responses/Error403"
 *         },
 *         "404": {
 *           "$ref": "#/components/responses/Error404"
 *         },
 *         "409": {
 *           "$ref": "#/components/responses/Error409"
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       },
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/RegistrationUpdate"
 *             }
 *           }
 *         }
 *       }
 *     },
 *     "delete": {
 *       "tags": [
 *         "Registrations"
 *       ],
 *       "summary": "Delete registration",
 *       "description": "Owner or admin only. Permanently removes the registration and releases its seat and active-registration slot.",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean",
 *                     "example": true
 *                   },
 *                   "data": {
 *                     "$ref": "#/components/schemas/EmptyResponse"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "400": {
 *           "$ref": "#/components/responses/Error400"
 *         },
 *         "401": {
 *           "$ref": "#/components/responses/Error401"
 *         },
 *         "403": {
 *           "$ref": "#/components/responses/Error403"
 *         },
 *         "404": {
 *           "$ref": "#/components/responses/Error404"
 *         },
 *         "409": {
 *           "$ref": "#/components/responses/Error409"
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       }
 *     }
 *   }
 * }
 */
const express = require("express");
const { getRegistrations, getRegistration, createRegistration, updateRegistration, deleteRegistration } = require("../controllers/registrations");
const { protect, authorize } = require("../middleware/auth");
const { serialize } = require("../middleware/serialize");

const router = express.Router();
router.use(protect);
router.get("/", getRegistrations);
router.post("/", authorize("member"), serialize(createRegistration));
router.route("/:id").get(getRegistration).put(serialize(updateRegistration)).delete(serialize(deleteRegistration));

module.exports = router;
