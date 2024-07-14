import * as z from 'zod'

export const UserModel = z.object({
  telegramID: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  languageCode: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isAdmin: z.boolean(),
})

export type UserModelType = z.TypeOf<typeof UserModel>
