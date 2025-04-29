"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Sty",
    zlecenia: 18,
    przychody: 2400,
    zgłoszenia: 24,
  },
  {
    name: "Lut",
    zlecenia: 22,
    przychody: 4000,
    zgłoszenia: 29,
  },
  {
    name: "Mar",
    zlecenia: 25,
    przychody: 5000,
    zgłoszenia: 32,
  },
  {
    name: "Kwi",
    zlecenia: 30,
    przychody: 8780,
    zgłoszenia: 38,
  },
  {
    name: "Maj",
    zlecenia: 40,
    przychody: 9890,
    zgłoszenia: 45,
  },
  {
    name: "Cze",
    zlecenia: 35,
    przychody: 9390,
    zgłoszenia: 40,
  },
  {
    name: "Lip",
    zlecenia: 29,
    przychody: 6490,
    zgłoszenia: 35,
  },
  {
    name: "Sie",
    zlecenia: 33,
    przychody: 8300,
    zgłoszenia: 38,
  },
  {
    name: "Wrz",
    zlecenia: 42,
    przychody: 12100,
    zgłoszenia: 47,
  },
  {
    name: "Paź",
    zlecenia: 38,
    przychody: 9800,
    zgłoszenia: 43,
  },
  {
    name: "Lis",
    zlecenia: 32,
    przychody: 8200,
    zgłoszenia: 37,
  },
  {
    name: "Gru",
    zlecenia: 27,
    przychody: 7000,
    zgłoszenia: 32,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="zlecenia" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar dataKey="przychody" fill="#0ea5e9" radius={[4, 4, 0, 0]} className="fill-blue-400" />
        <Bar dataKey="zgłoszenia" fill="#f43f5e" radius={[4, 4, 0, 0]} className="fill-rose-400" />
      </BarChart>
    </ResponsiveContainer>
  )
}
