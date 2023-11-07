import supertest from "supertest";
import app from "../app";

const api = supertest(app);

test("flags are returned as json", async () => {
  await api
    .get("/api/flags")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("segments are returned as json", async () => {
  await api
    .get("/api/segments")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("attributes are returned as json", async () => {
  await api
    .get("/api/attributes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("sdk keys are returned as json", async () => {
  await api
    .get("/api/flags")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("flag by flag Key is returned as json", async () => {
  await api
    .get("/api/flags/flag-1")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("segment by segment Key is returned as json", async () => {
  await api
    .get("/api/segments/internal-testers")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});
