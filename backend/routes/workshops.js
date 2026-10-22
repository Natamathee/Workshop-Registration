/**
 * @swagger
 * {
 *   "/api/v1/workshops": {
 *     "get": {
 *       "tags": [
 *         "Workshops"
 *       ],
 *       "summary": "List or search active workshops",
 *       "description": "Public list sorted by workshop date and name. Includes past workshops that have not been deleted.",
 *       "security": [],
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
 *                       "$ref": "#/components/schemas/Workshop"
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
 *       "parameters": [
 *         {
 *           "name": "search",
 *           "in": "query",
 *           "description": "Case-insensitive literal substring in name, description, instructor, or location.",
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ]
 *     },
 *     "post": {
 *       "tags": [
 *         "Workshops"
 *       ],
 *       "summary": "Create workshop",
 *       "description": "Admin only. Date is today or later in UTC; capacity is a positive integer.",
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
 *                     "$ref": "#/components/schemas/Workshop"
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
 *               "$ref": "#/components/schemas/WorkshopInput"
 *             }
 *           }
 *         }
 *       }
 *     }
 *   },
 *   "/api/v1/workshops/{id}": {
 *     "parameters": [
 *       {
 *         "$ref": "#/components/parameters/ResourceId"
 *       }
 *     ],
 *     "get": {
 *       "tags": [
 *         "Workshops"
 *       ],
 *       "summary": "Get workshop",
 *       "description": "Public detail for an active workshop.",
 *       "security": [],
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
 *                     "$ref": "#/components/schemas/Workshop"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "400": {
 *           "$ref": "#/components/responses/Error400"
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
 *         "Workshops"
 *       ],
 *       "summary": "Update workshop",
 *       "description": "Admin only. Omitted fields retain their values. Capacity cannot fall below current registration count. Rescheduling cannot cause any member to exceed three active registrations. Date cannot be past.",
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
 *                     "$ref": "#/components/schemas/Workshop"
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
 *               "$ref": "#/components/schemas/WorkshopUpdate"
 *             }
 *           }
 *         }
 *       }
 *     },
 *     "delete": {
 *       "tags": [
 *         "Workshops"
 *       ],
 *       "summary": "Delete workshop",
 *       "description": "Admin only. Soft delete: isActive=false. Registration history remains readable and no longer counts toward active registrations.",
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
const { getWorkshops, getWorkshop, createWorkshop, updateWorkshop, deleteWorkshop } = require("../controllers/workshops");
const { protect, authorize } = require("../middleware/auth");
const { serialize } = require("../middleware/serialize");

const router = express.Router();
router.route("/").get(getWorkshops).post(protect, authorize("admin"), serialize(createWorkshop));
router.route("/:id").get(getWorkshop).put(protect, authorize("admin"), serialize(updateWorkshop)).delete(protect, authorize("admin"), serialize(deleteWorkshop));

module.exports = router;
