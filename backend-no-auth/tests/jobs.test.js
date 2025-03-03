const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");

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

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called", async () => {
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
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobNames = jobsAfterPost.map((job) => job.name);
    expect(jobNames).toContain(newJob.name);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
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

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);

  expect(updatedJobCheck.description).toBe(updatedJob.description);
  expect(updatedJobCheck.company.name).toBe(updatedJob.company.name);
  expect(updatedJobCheck.company.contactEmail).toBe(updatedJob.company.contactEmail);
  expect(updatedJobCheck.company.contactPhone).toBe(updatedJob.company.contactPhone);
  });

  it("should return 400 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/jobs/:id
  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});
