import styles from "./App.module.css";

const App = () => (
  <main className={styles.appShell}>
    <div className={styles.setupCard}>
      <span className={styles.brandMark}>+</span>
      <p className={styles.label}>Luma Clinic</p>
      <h1>Clinic operations, in one clear view.</h1>
      <p className={styles.description}>
        A calm workspace for appointments, patient records, and care team coordination.
      </p>
    </div>
  </main>
);

export default App;
