import styles from "./index.module.less";
const NavFooter = () => {
  return (
    <div className={styles.footer}>
      <div>
        <a href="https://react.dev/" target="_blank" rel="noreferrer">
          React
        </a>
        <span className="gutter">|</span>
        <a
          href="https://ant-design.antgroup.com/components/overview"
          target="_blank"
          rel="noreferrer"
        >
          Ant Design
        </a>
        <span className="gutter">|</span>
        <a
          href="https://developer.mozilla.org/zh-CN/"
          target="_blank"
          rel="noreferrer"
        >
          MDN
        </a>
        <span className="gutter">|</span>
        <a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer">
          Iconfont
        </a>
      </div>
      <div>Copyright ©2025 Freight System All Rights Reserved.</div>
    </div>
  );
};

export default NavFooter;
