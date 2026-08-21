import TopNavs from './TopNavs';
import Title from './Logo';

const HeaderNav = () => {
  return (
    <div
      className="relative flex w-full items-center justify-around border-b-1 border-gray-300 bg-gray-100/60"
      style={{ height: '100px' }}
    >
      <div className="flex items-baseline gap-4">
        {/*  套一层解决垂直对齐问题  */}
        <Title></Title>
      </div>
      <TopNavs></TopNavs>
    </div>
  );
};

export default HeaderNav;
