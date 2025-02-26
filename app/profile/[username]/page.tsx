type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function ProfilePage(props: Props) {
  const { username } = await props.params;

  return (
    <div>
      <h2>{username}'s Profile</h2>
    </div>
  );
}
