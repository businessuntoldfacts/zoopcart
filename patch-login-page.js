const fs = require('fs');
let code = fs.readFileSync('src/app/admin/login/page.tsx', 'utf8');

const newLoginLogic = `
import { loginAdmin } from "./actions";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@zypcart.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    const res = await loginAdmin(email, password);
    if (res.success) {
      window.location.href = "/admin";
    } else {
      setErrorMsg(res.error || "Login failed");
      setLoading(false);
    }
  };
`;

code = code.replace(/export default function AdminLogin\(\) \{[\s\S]*?const handleLogin = \(e: React\.FormEvent\) => \{[\s\S]*?\}\s*\}, 1000\);\s*\};\s*/, newLoginLogic);

// Add error message UI and bind email input to state
const errorUI = `
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold text-center">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
`;
code = code.replace(/<form onSubmit=\{handleLogin\} className="space-y-5">/, errorUI);

code = code.replace(/defaultValue="admin@zypcart.com"/, 'value={email} onChange={e => setEmail(e.target.value)}');

fs.writeFileSync('src/app/admin/login/page.tsx', code);
