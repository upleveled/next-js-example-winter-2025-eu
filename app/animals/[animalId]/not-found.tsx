import Link from 'next/link';

export const metadata = {
  title: 'Animal not found',
};

export default function AnimalNotFound() {
  // You can add any UI inside RootNotFound, including
  // Animations.
  return (
    <div>
      Sorry, this animal was not found make sure you choose an animal id that
      exists
      <div>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
