import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function getMe(req: Request, res: Response) {
  const user = await userService.getProfile(req.user!.id);
  res.json({ success: true, data: user });
}

export async function updateProfile(req: Request, res: Response) {
  const profile = await userService.updateProfile(req.user!.id, req.body);
  res.json({ success: true, data: profile });
}

export async function changePassword(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ success: false, error: { message: 'oldPassword and newPassword required' } });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ success: false, error: { message: 'Password must be at least 8 characters' } });
    return;
  }
  await userService.changePassword(req.user!.id, oldPassword, newPassword);
  res.json({ success: true, data: { message: 'Password changed successfully' } });
}

export async function uploadProfilePicture(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ success: false, error: { message: 'No file provided' } });
    return;
  }
  const url = await userService.uploadProfilePicture(req.user!.id, req.file.path);
  res.json({ success: true, data: { url } });
}

export async function deleteAccount(req: Request, res: Response) {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ success: false, error: { message: 'Password required' } });
    return;
  }
  await userService.deleteAccount(req.user!.id, password);
  res.json({ success: true, data: { message: 'Account deleted successfully' } });
}

export async function searchUsers(req: Request, res: Response) {
  const query = req.query.q as string;
  const users = await userService.searchUsers(query, req.user!.id);
  res.json({ success: true, data: users });
}
