import styles from "./index.module.less";

const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div className={styles.subTitle}>Welcome</div>
        <div className={styles.title}>Freight Management System</div>
        <div className={styles.desc}>
          Technology Stack: React18.3 + ReactRouter7.5 + AntD5.24 +
          TypeScript5.7 + Vite6.2 + zustand5.0
        </div>
      </div>
      <div className={styles.img}></div>
    </div>
  );
};

export default Welcome;
