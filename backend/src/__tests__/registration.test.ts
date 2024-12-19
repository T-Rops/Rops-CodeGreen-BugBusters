// import { describe, it, expect, vi, beforeEach } from "vitest";
// import request from "supertest";
// import express from "express";
// import router from "../routes/registration";
// import { pool } from "..";  // Assuming pool is exported from your index file

// // Mock the database pool
// vi.mock("../index", () => ({
//   pool: {
//     query: vi.fn(),  // Mocking the query method for the database
//   },
// }));

// const app = express();
// app.use(express.json());
// app.use(router);

// describe("Registration API", () => {
//   beforeEach(() => {
//     vi.clearAllMocks(); // Clear mocks before each test to avoid state carry-over
//   });

//   describe("GET /get", () => {
//     it("should fetch all registrations successfully", async () => {
//       const mockRegistrations = [
//         { user_id: 1, license_number: "123", school_email: "test@example.com" },
//         { user_id: 2, license_number: "456", school_email: "test2@example.com" },
//       ];
//       (pool.query as any).mockResolvedValue({ rows: mockRegistrations });

//       const response = await request(app).get("/get");

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(mockRegistrations);
//       expect(pool.query).toHaveBeenCalledOnce();
//       expect(pool.query).toHaveBeenCalledWith(
//         "SELECT user_id, license_number, school_email, first_name, last_name, middle_name, date_of_birth, driver_type, sex FROM registrations"
//       );
//     });

//     it("should handle database errors", async () => {
//       const dbError = new Error("Database query failed");
//       (pool.query as any).mockRejectedValue(dbError);

//       const response = await request(app).get("/get");

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({
//         title: "Unknown Error",
//         message: dbError.message,
//       });
//     });
//   });

//   describe("POST /add", () => {
//     it("should return 400 if missing required information", async () => {
//       const incompleteData = {
//         license_number: "12345678",
//         school_email: "test@example.com",
//         first_name: "John",
//         // Missing required fields
//       };

//       const response = await request(app).post("/add").send(incompleteData);

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({
//         title: "Missing Information",
//         message: "Please input all information needed.",
//       });
//     });

//     it("should add a registration successfully", async () => {
//       const registrationData = {
//         license_number: "12345678",
//         school_email: "test@example.com",
//         first_name: "John",
//         last_name: "Doe",
//         middle_name: "A",
//         date_of_birth: "1990-01-01",
//         driver_type: "Student",
//         sex: "M",
//       };

//       (pool.query as any).mockResolvedValueOnce({ rowCount: 1 });

//       const response = await request(app).post("/add").send(registrationData);

//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({
//         title: "Success",
//         message: "Registration created successfully.",
//       });

//       expect(pool.query).toHaveBeenCalledWith(
//         expect.stringContaining("INSERT INTO registrations"),
//         expect.arrayContaining([
//           "12345678", "test@example.com", "John", "Doe", "A", "1990-01-01", "Student", "M",
//         ])
//       );
//     });

//     it("should handle database errors on registration creation", async () => {
//       const registrationData = {
//         license_number: "12345678",
//         school_email: "test@example.com",
//         first_name: "John",
//         last_name: "Doe",
//         middle_name: "A",
//         date_of_birth: "1990-01-01",
//         driver_type: "Student",
//         sex: "M",
//       };

//       const dbError = new Error("Database insertion failed");
//       (pool.query as any).mockRejectedValue(dbError);

//       const response = await request(app).post("/add").send(registrationData);

//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({
//         title: "Server Error",
//         message: dbError.message,
//       });
//     });
//   });

//   describe("POST /approve", () => {
//     it("should return 400 if license number is not provided", async () => {
//       const response = await request(app).post("/approve").send({});

//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({
//         title: "Validation Error",
//         message: "License number is required.",
//       });
//     });

//     it("should return 404 if registration not found", async () => {
//       const license_number = "12345678";
//       (pool.query as any).mockResolvedValueOnce({ rows: [] });  // No matching registration

//       const response = await request(app).post("/approve").send({ license_number });

//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({
//         title: "Not Found",
//         message: "Registration with the specified license number not found.",
//       });
//     });

//     it("should approve the registration and update driver details", async () => {
//       const license_number = "12345678";
//       const mockRegistration = { school_email: "test@example.com", user_id: 1 };
//       const mockDriver = { email: "", id: 1 };

//       (pool.query as any)
//         .mockResolvedValueOnce({ rows: [mockRegistration] })  // Mock registration fetch
//         .mockResolvedValueOnce({ rows: [mockDriver] });  // Mock driver fetch

//       const response = await request(app).post("/approve").send({ license_number });

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({
//         title: "Driver Updated!",
//         message: "Driver's email and user_id have been updated successfully.",
//       });

//       expect(pool.query).toHaveBeenCalledTimes(3);  // Expect 3 queries: registration, driver, deletion
//     });
//   });
// });