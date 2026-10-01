export const OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "Dollar Shave Club Customer Service API",
    version: "1.0.0",
    description: "API for Google CX Agent Studio to query order status, update shipping addresses, process free replacements, delay Restock Box billing, and dispatch secure payment links."
  },
  servers: [
    {
      url: "https://cxas-dsc-api-137470913560.us-central1.run.app",
      description: "Production Cloud Run API"
    },
    {
      url: "http://localhost:8081",
      description: "Local Development API"
    }
  ],
  paths: {
    "/api/orders/track": {
      post: {
        operationId: "trackOrder",
        summary: "Track order and retrieve subscription cadence",
        description: "Looks up customer order status, carrier tracking, ETA, and subscription schedule using either customer email or order number.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["identifier"],
                properties: {
                  identifier: {
                    type: "string",
                    description: "Customer email (e.g., alex@example.com) or order number (e.g., DSC-8832)."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Tracking and account details retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    found: { type: "boolean" },
                    customer: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        email: { type: "string" },
                        shippingAddress: { type: "string" }
                      }
                    },
                    order: {
                      type: "object",
                      properties: {
                        orderNumber: { type: "string" },
                        status: { type: "string" },
                        trackingNumber: { type: "string" },
                        carrier: { type: "string" },
                        eta: { type: "string" },
                        lastCarrierScan: { type: "string" },
                        isLost: { type: "boolean" },
                        items: {
                          type: "array",
                          items: { type: "string" }
                        }
                      }
                    },
                    subscription: {
                      type: "object",
                      properties: {
                        planName: { type: "string" },
                        cadence: { type: "string" },
                        nextBillDate: { type: "string" },
                        isStarterSetTrial: { type: "boolean" },
                        notes: { type: "string" }
                      }
                    },
                    trackingInsight: {
                      type: "object",
                      properties: {
                        statusSummary: { type: "string" },
                        isLostInTransit: { type: "boolean" },
                        recommendedAction: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/customers/address": {
      post: {
        operationId: "updateShippingAddress",
        summary: "Update customer shipping address",
        description: "Updates the customer primary shipping address in the database for all current and future boxes.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "newAddress"],
                properties: {
                  email: {
                    type: "string",
                    description: "Customer email address."
                  },
                  newAddress: {
                    type: "string",
                    description: "New shipping address (e.g., 123 Main St, Austin TX 78701)."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Address updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    customer: {
                      type: "object",
                      properties: {
                        email: { type: "string" },
                        shippingAddress: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/orders/replacement": {
      post: {
        operationId: "createReplacementOrder",
        summary: "Process a free replacement order",
        description: "Creates and queues an immediate zero-cost replacement order for items lost in transit or damaged in shipment (e.g., exploded Shave Butter). Ships within 24 hours.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "originalOrderNumber", "reason"],
                properties: {
                  email: {
                    type: "string",
                    description: "Customer email address."
                  },
                  originalOrderNumber: {
                    type: "string",
                    description: "Original order number being replaced (e.g., DSC-9104, DSC-7721)."
                  },
                  reason: {
                    type: "string",
                    description: "Reason for replacement: 'LOST_IN_TRANSIT', 'DAMAGED_ITEM', etc."
                  },
                  items: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific items to replace (e.g., ['Dr. Carver\\'s Easy Shave Butter (6 oz)']). Omit to replace entire box."
                  },
                  newAddress: {
                    type: "string",
                    description: "Optional updated destination address if customer moved."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Replacement order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    replacement: {
                      type: "object",
                      properties: {
                        replacementId: { type: "string" },
                        originalOrderNumber: { type: "string" },
                        shippingAddress: { type: "string" },
                        items: {
                          type: "array",
                          items: { type: "string" }
                        },
                        status: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/subscriptions/delay": {
      post: {
        operationId: "delayRestockBox",
        summary: "Delay next Restock Box billing date",
        description: "Postpones the upcoming billing date for the full-size Restock Box so customer has ample time with their Starter Set.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "newBillDate"],
                properties: {
                  email: {
                    type: "string",
                    description: "Customer email address."
                  },
                  newBillDate: {
                    type: "string",
                    description: "New desired billing date (e.g., October 15, 2026)."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Restock Box successfully delayed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/billing/secure-link": {
      post: {
        operationId: "sendSecurePaymentLink",
        summary: "Dispatch secure Shop Pay payment link",
        description: "Dispatches a secure Shop Pay link via SMS and email to the customer contact info on file to update card credentials safely without taking credit cards over chat.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    description: "Customer email address on file."
                  },
                  channel: {
                    type: "string",
                    enum: ["SMS", "EMAIL", "BOTH"],
                    description: "Notification channel (defaults to BOTH)."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Secure payment link dispatched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    channel: { type: "string" },
                    recipientEmail: { type: "string" },
                    recipientPhone: { type: "string" },
                    message: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
