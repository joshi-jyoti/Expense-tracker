"use client"

import { useState, useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from 'lucide-react'

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  date: string
  description: string
}

export default function ExpenseTracker() {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('transactions')
    if (stored) {
      setTransactions(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(amount)
    if (isNaN(value)) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: value,
      category,
      date,
      description
    }

    setTransactions(prev => [...prev, newTransaction])
    setAmount("")
    setCategory("")
    setDate("")
    setDescription("")
  }

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = monthlyIncome - monthlyExpense

  return (
    <div className="min-h-screen bg-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-[#DEB887]">
          MONTHLY EXPENSE TRACKER
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="bg-slate-700 p-6 rounded-lg space-y-2">
            <h2 className="text-xl text-blue-400">Monthly Income</h2>
            <p className="text-3xl text-white">₹ {monthlyIncome}</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg space-y-2">
            <h2 className="text-xl text-red-400">Monthly Expense</h2>
            <p className="text-3xl text-white">₹ {monthlyExpense}</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg space-y-2">
            <h2 className="text-xl text-emerald-400">Balance</h2>
            <p className="text-3xl text-white">₹ {balance}</p>
          </div>
        </div>

        <div className="bg-slate-700 p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-coral-400">ADD NEW</h2>
            
            <RadioGroup value={type} onValueChange={(v: 'income' | 'expense') => setType(v)} className="flex gap-8">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="text-white text-xl">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="text-white text-xl">Income</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-900 text-white border-none"
                  placeholder="₹ 1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category" className="bg-slate-900 border-none text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-900 text-white border-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-900 text-white border-none"
                  placeholder="Enter description"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
              Add Transaction
            </Button>
          </form>
        </div>

        <div className="bg-slate-700 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                  <TableHead className="text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-white">
                      <span className={transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">₹ {transaction.amount}</TableCell>
                    <TableCell className="text-white">{transaction.category}</TableCell>
                    <TableCell className="text-white">{transaction.date}</TableCell>
                    <TableCell className="text-white">{transaction.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-400 hover:text-red-500 hover:bg-slate-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete transaction</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}