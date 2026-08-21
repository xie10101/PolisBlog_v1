export default function Footer() {
      /**
         *   const startTime = new Date("2020-01-01T00:00:00");
         const [uptime, setUptime] = useState("");

        useEffect(() => {
            const update = () => {
            const now = new Date();
            const diff = now - startTime;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setUptime(`${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`);
            };
            update();
            const timer = setInterval(update, 1000);
            return () => clearInterval(timer);
        }, []);
      */
  return (
            <footer className="w-full h-17 text-center text-sm text-gray-600 border-t border-gray-200 py-4 mt-4" style={{backgroundColor:"#f5f5f5"}}>   
                <p className="mb-1">
                © 2020–2025 <span className="font-semibold">楚楚翎</span> · 本站已安全运行{" "}
                <span className="text-blue-500">xx</span>
                </p>
                <p className="flex flex-wrap justify-center items-center gap-2 text-xs mt-2">
                <span>本站总字数：312k</span>
                <span>站点启动时长 ≈ 4:43</span>
                <a
                    href="xx"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-600"
                >
                    豫ICP备2021028259号-1
                </a>
                <a
                    href="xx"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center hover:text-blue-600"
                >
                    豫公网安备 41058102000241号
                </a>
                </p>
            </footer> 
  );
} 
