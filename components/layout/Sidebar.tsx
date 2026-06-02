 export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Sidebar</h2>
        <ul className="space-y-2">
          <li>
            <a href="/" className="block rounded px-3 py-2 hover:bg-slate-800">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/clients" className="block rounded px-3 py-2 hover:bg-slate-800">
              Clients
            </a>
          </li>
          <li>
            <a href="/products" className="block rounded px-3 py-2 hover:bg-slate-800">
              Products
            </a>
          </li>
          <li>
            <a href="/sales" className="block rounded px-3 py-2 hover:bg-slate-800">
              Sales
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

> rapel-erp@1.0.0 dev
> next dev

▲ Next.js 16.2.7 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.0.107:3000
- Environments: .env
✓ Ready in 2.2s

○ Compiling / ...
⨯ ./src/app/layout.tsx:1:1
Module not found: Can't resolve '@/components/layout/Sidebar'
> 1 | import Sidebar from '@/components/layout/Sidebar';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export default function DashboardLayout({
  4 |   children,

Import map: aliased to relative './src/components/layout/Sidebar' inside of [project]/


https://nextjs.org/docs/messages/module-not-found



./src/app/page.tsx:4:1
Module not found: Can't resolve '@/lib/utils'
  2 | import { useEffect, useState } from 'react';
  3 | import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';
> 4 | import { formatCurrency } from '@/lib/utils';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 |
  6 | export default function Dashboard() {
  7 |   const [stats, setStats] = useState({ sales: 0, products: 0, clients: 0, lowStock: 0 });

Import map: aliased to relative './src/lib/utils' inside of [project]/


Import traces:
  Client Component Browser:
    ./src/app/page.tsx [Client Component Browser]
    ./src/app/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/page.tsx [Client Component SSR]
    ./src/app/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


○ Compiling /_error ...
 GET / 500 in 15.0s (next.js: 14.6s, application-code: 435ms)
[browser] Uncaught Error: ./src/app/layout.tsx:1:1
Module not found: Can't resolve '@/components/layout/Sidebar'
> 1 | import Sidebar from '@/components/layout/Sidebar';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export default function DashboardLayout({
  4 |   children,

Import map: aliased to relative './src/components/layout/Sidebar' inside of [project]/


https://nextjs.org/docs/messages/module-not-found


    at <unknown> (Error: ./src/app/layout.tsx:1:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
    at <unknown> (Error: (./src/app/layout.tsx:1:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
[browser] ./src/app/layout.tsx:1:1
Module not found: Can't resolve '@/components/layout/Sidebar'
> 1 | import Sidebar from '@/components/layout/Sidebar';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export default function DashboardLayout({
  4 |   children,

Import map: aliased to relative './src/components/layout/Sidebar' inside of [project]/

https://nextjs.org/docs/messages/module-not-found
    at handleErrors (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
    at processMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2835:28)
    at <unknown> (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2680:13)
    at WebSocket.handleMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2325:17) (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
[browser] ./src/app/page.tsx:4:1
Module not found: Can't resolve '@/lib/utils'
  2 | import { useEffect, useState } from 'react';
  3 | import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';
> 4 | import { formatCurrency } from '@/lib/utils';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 |
  6 | export default function Dashboard() {
  7 |   const [stats, setStats] = useState({ sales: 0, products: 0, clients: 0, lowStock: 0 });

Import map: aliased to relative './src/lib/utils' inside of [project]/

Import traces:
  Client Component Browser:
    ./src/app/page.tsx [Client Component Browser]
    ./src/app/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/page.tsx [Client Component SSR]
    ./src/app/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found
    at handleErrors (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
    at processMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2835:28)
    at <unknown> (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2680:13)
    at WebSocket.handleMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2325:17) (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
[browser] ./src/app/layout.tsx:1:1
Module not found: Can't resolve '@/components/layout/Sidebar'
> 1 | import Sidebar from '@/components/layout/Sidebar';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 |
  3 | export default function DashboardLayout({
  4 |   children,

Import map: aliased to relative './src/components/layout/Sidebar' inside of [project]/

https://nextjs.org/docs/messages/module-not-found
    at handleErrors (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
    at processMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2835:28)
    at <unknown> (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2680:13)
    at WebSocket.handleMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2325:17) (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
[browser] ./src/app/page.tsx:4:1
Module not found: Can't resolve '@/lib/utils'
  2 | import { useEffect, useState } from 'react';
  3 | import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';
> 4 | import { formatCurrency } from '@/lib/utils';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 |
  6 | export default function Dashboard() {
  7 |   const [stats, setStats] = useState({ sales: 0, products: 0, clients: 0, lowStock: 0 });

Import map: aliased to relative './src/lib/utils' inside of [project]/

Import traces:
  Client Component Browser:
    ./src/app/page.tsx [Client Component Browser]
    ./src/app/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/page.tsx [Client Component SSR]
    ./src/app/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found
    at handleErrors (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)
    at processMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2835:28)
    at <unknown> (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2680:13)
    at WebSocket.handleMessage (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2325:17) (file://C:/R.A.P.E.L ERP/rapel-erp/.next/dev/static/chunks/node_modules_next_dist_client_16lnmlo._.js:2774:21)

