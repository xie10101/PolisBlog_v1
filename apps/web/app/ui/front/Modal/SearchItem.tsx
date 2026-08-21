//  单个搜索项的设置
import './SearchItem.css';
interface BlogSearchItem {
  slug: string;
  title: string;
  except: string;
  tags: [];
}

type Props = {
  item: BlogSearchItem;
  onClick?: () => void;
};
const SearchItem = ({
  item,
  onClick,
}: {
  item: BlogSearchItem;
  onClick?: () => void;
}) => {
  return (
    <li
      className="flex w-full cursor-pointer p-2 hover:bg-gray-100"
      onClick={onClick}
    >
      <span className="m-2 block h-2 w-2 rounded-full bg-gray-500"></span>

      <main className="w-full border-b-2 border-dashed border-gray-300 pb-3">
        <h3 className="mb-2 inline-block border-b-2 border-gray-300">
          {item.title}
        </h3>
        <p className="test">{item.except}</p>
      </main>
    </li>
    //  处理方式 - 宽度固定 -不受文字限制 - 超出部分省略号
  );
};

export default SearchItem;
