export const useUser = () => useState<{
  userId: string;
}>('user', () => ({
  userId: Date.now() + Math.random().toString(36).substring(2, 9)
}))
