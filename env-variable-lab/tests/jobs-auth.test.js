const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const jobs = [
    {
      title: "Software Engineer",
      type: "Full-time",
      description: "Develop and maintain software applications.",
      company: {
        name: "Tech Innovations Inc.",
        contactEmail: "contact@techinnovations.com",
        contactPhone: "123-456-7890",
      },
    },
    {
      title: "Marketing Specialist",
      type: "Part-time",
      description: "Create and execute marketing strategies.",
      company: {
        name: "Creative Solutions Ltd.",
        contactEmail: "hr@creativesolutions.com",
        contactPhone: "987-654-3210",
      },
    },
  ];

let token = null;

beforeAll(async () => {
  await Job.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    email: "john@example.com",
    password: "R3g5T7#gh",
    phone_number: "1234567890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    membership_status: "Inactive",
  });
  token = result.body.token;
});

describe("Given there are initially some jobs saved", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Promise.all([
      api
        .post("/api/jobs")
        .set("Authorization", "bearer " + token)
        .send(jobs[0]),
      api
        .post("/api/jobs")
        .set("Authorization", "bearer " + token)
        .send(jobs[1]),
    ]);
  });

  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    await api
      .get("/api/jobs")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one job when POST /api/jobs is called", async () => {
    const newJob = {
        title: "Data Analyst",
        type: "Contract",
        description: "Analyze data trends and generate reports.",
        company: {
          name: "Insight Analytics",
          contactEmail: "jobs@insightanalytics.com",
          contactPhone: "555-123-4567",
        },
      };
    await api
      .post("/api/jobs")
      .set("Authorization", "bearer " + token)
      .send(newJob)
      .expect(201);
  });

  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get("/api/jobs/" + job._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one job by ID when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
        title: "Data Analyst",
        type: "Contract",
        description: "Analyze data trends and generate reports.",
        company: {
          name: "Insight Analytics",
          contactEmail: "jobssssss@insightanalytics.com",
          contactPhone: "555-123-456712111",
        },
      };

    const response = await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", "bearer " + token)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    console.log("Response body:", response.body);
  
    const updatedJobCheck = await Job.findById(job._id);
    console.log("Updated job:", updatedJobCheck);
  
  expect(updatedJobCheck.description).toBe(updatedJob.description);
  expect(updatedJobCheck.company.name).toBe(updatedJob.company.name);
  expect(updatedJobCheck.company.contactEmail).toBe(updatedJob.company.contactEmail);
  expect(updatedJobCheck.company.contactPhone).toBe(updatedJob.company.contactPhone);
  });
  

  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .delete("/api/jobs/" + job._id)
      .set("Authorization", "bearer " + token)
      .expect(204);
    const jobCheck = await Job.findById(job._id);
    expect(jobCheck).toBeNull();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
