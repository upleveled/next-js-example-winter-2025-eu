import Image from 'next/image';
import smilingCat from '../public/images/smiling-cat.webp';
import GenerateButton from './GenerateButton';
import LocalStorage from './LocalStorage';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <GenerateButton />
      <LocalStorage />
      <h1>Hello UpLeveled</h1>

      {/* This is not optimized */}
      <img src="/images/smiling-cat.webp" alt="beautiful sleeping cat" />

      {/* The Image component is optimized*/}
      <Image
        src="/images/smiling-cat.webp"
        alt="beautiful sleeping cat"
        width={300}
        height={200}
      />

      <Image src={smilingCat} alt="beautiful sleeping cat" />
    </div>
  );
}
