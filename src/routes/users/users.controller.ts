import { response, catchedAsync } from "../../utils/index.js";

import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../../services/firestoreService.js";

export const getUsers = catchedAsync(async (req, res) => {
  const users = await getDocuments("users");
  return response(res, req, 200, users);
});

export const getUserById = catchedAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const user = await getDocument("users", id);
  return response(res, req, 200, user);
});

export const postUser = catchedAsync(async (req, res) => {
  const user = req.body;
  const created = await createDocument("users", user);
  return response(res, req, 201, created);
});

export const putUser = catchedAsync(async (req, res) => {
  const { id } = req.body as { id: string };
  const user = req.body;
  const updated = await updateDocument("users", id, user);
  return response(res, req, 200, updated);
});

export const deleteUser = catchedAsync(async (req, res) => {
  const { id } = req.body as { id: string };
  await deleteDocument("users", id);
  return response(res, req, 200, { deleted: id });
});
