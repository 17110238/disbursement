import PropTypes from 'prop-types';

const NonAuthLayout = (props) => {
  return <>{props.children}</>;
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
};

export default NonAuthLayout;
