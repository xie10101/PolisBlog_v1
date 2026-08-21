import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

export default function Overview() {
  // const cardData = [
  //   {
  //     title: 'Total Sales',
  //     description: 'Total sales for the current month',
  //     value: '0,000',
  //     icon: 'mdi:cart',
  //     color: 'bg-[#F59E0B]',
  //   },
  //   {
  //     title: 'Total Orders',
  //     description: 'Total orders for the current month',
  //     value: '10',
  //     icon: 'mdi:package',
  //   },
  // ];

  return (
    <>
      <div className="flex h-full w-full flex-col gap-4">
        <main className="flex flex-1 flex-col gap-6">
          <header className="relative flex flex-row">
            <div className="flex flex-col">
              <h2 className="text-2xl font-normal">Dashboard</h2>
              <p className="text-lg">
                Welcome back! Here what is going on with your blog today
              </p>
            </div>
            <Button variant="outline" className="absolute right-10">
              写文章
            </Button>
          </header>
          <main className="flex h-40 flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>今日新文章</CardTitle>
                <CardAction>文章图标</CardAction>
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-bold">12</h2>
              </CardContent>
              <CardFooter>
                <p>+2 较往日</p>
              </CardFooter>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>今日新评论</CardTitle>
                <CardAction>评论图标</CardAction>
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-bold">456</h2>
              </CardContent>
              <CardFooter>
                <p>+2 较往日</p>
              </CardFooter>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>今日新用户</CardTitle>
                <CardAction>用户图标</CardAction>
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-bold">789</h2>
              </CardContent>
              <CardFooter>
                <p>+2 较往日</p>
              </CardFooter>
            </Card>
          </main>
          {/* 列表项 */}
          <main className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div>
                  <p className="text-lg font-bold">
                    {' '}
                    Recently Published Articles
                  </p>
                  <p className="text-sm text-gray-500">
                    {' '}
                    Latest articles from your blog
                  </p>
                </div>
                <CardContent className="flex-row">
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map(invoice => (
                        <TableRow key={invoice.invoice}>
                          <TableCell className="font-medium">
                            {invoice.invoice}
                          </TableCell>
                          <TableCell>{invoice.paymentStatus}</TableCell>
                          <TableCell>{invoice.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            {invoice.totalAmount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div>
                  <p className="text-lg font-bold">Comment Activity</p>
                  <p className="text-sm text-gray-500">
                    Recent comments on your articles
                  </p>
                </div>
                <CardContent className="flex-row">
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map(invoice => (
                        <TableRow key={invoice.invoice}>
                          <TableCell className="font-medium">
                            {invoice.invoice}
                          </TableCell>
                          <TableCell>{invoice.paymentStatus}</TableCell>
                          <TableCell>{invoice.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            {invoice.totalAmount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </CardHeader>
            </Card>
          </main>
        </main>
      </div>
    </>
  );
}
