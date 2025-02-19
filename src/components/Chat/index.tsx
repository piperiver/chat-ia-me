"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import perfilImage from "../../assets/perfil.jpeg";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Message {
  role: string;
  text: string;
}

const API_URL = process.env.NEXT_PUBLIC_API || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export default function ChatReclutadores() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [showErrors, setShowErrors] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveChat = async (messages: Message[]) => {
    try {
      if (!supabase) {
        return null;
      }
      if (!chatId) {
        // Primera vez: crear nuevo chat
        const { data, error } = await supabase
          .from("chats")
          .insert([
            {
              user_name: userData.name,
              user_email: userData.email,
              conversation: messages,
              created_at: new Date().toISOString(),
            },
          ])
          .select();

        if (error) throw error;
        if (data) setChatId(data[0].id);
      } else {
        // Actualizar chat existente
        const { error } = await supabase
          .from("chats")
          .update({ conversation: messages })
          .eq("id", chatId);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleUserDataSubmit = () => {
    if (!userData.name || !userData.email || !isValidEmail(userData.email)) {
      setShowErrors(true);
      return;
    }

    setShowModal(false);
    setMessages([
      {
        role: "assistant",
        text: `¡Hola ${userData.name}! Bienvenido(a) a nuestro chat. Estoy aquí para responder tus preguntas sobre mi experiencia laboral. ¿Qué te gustaría saber?`,
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ message: input, prevMessages: messages }),
      });

      const data = await response.json();
      const assistantMessage = { role: "assistant", text: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveChat([...messages, userMessage, assistantMessage]);
    } catch {
      const errorMessage = {
        role: "assistant",
        text: "Hubo un error al procesar tu pregunta.",
      };
      setMessages((prev) => [...prev, userMessage, errorMessage]);
      await saveChat([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPressPersonalData = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleUserDataSubmit();
    }
  };

  const handleKeyPressMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <Dialog open={showModal} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Bienvenido al Chat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                placeholder="Tu nombre"
                value={userData.name}
                onKeyPress={handleKeyPressPersonalData}
                onChange={(e) => {
                  setUserData((prev) => ({ ...prev, name: e.target.value }));
                  setShowErrors(false);
                }}
                className={showErrors && !userData.name ? "border-red-500" : ""}
              />
              {showErrors && !userData.name && (
                <span className="text-red-500 text-sm">
                  El nombre es obligatorio
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={userData.email}
                onChange={(e) => {
                  setUserData((prev) => ({ ...prev, email: e.target.value }));
                  setShowErrors(false);
                }}
                onKeyPress={handleKeyPressPersonalData}
                className={
                  showErrors &&
                  (!userData.email ||
                    (userData.email && !isValidEmail(userData.email)))
                    ? "border-red-500"
                    : ""
                }
              />
              {showErrors && !userData.email && (
                <span className="text-red-500 text-sm">
                  El correo electrónico es obligatorio
                </span>
              )}
              {showErrors &&
                userData.email &&
                !isValidEmail(userData.email) && (
                  <span className="text-red-500 text-sm">
                    Por favor, ingresa un correo electrónico válido
                  </span>
                )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUserDataSubmit}>Comenzar Chat</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-screen p-4">
        <div className="flex-grow overflow-auto border p-4 rounded-xl">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-center my-6 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={
                    msg.role === "user"
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          userData.name
                        )}&background=random`
                      : perfilImage.src
                  }
                  alt={msg.role === "user" ? "Usuario" : "Asistente"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`relative max-w-[70%] ${
                  msg.role === "user" ? "mr-3" : "ml-3"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-green-700 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2 my-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={perfilImage.src}
                  alt="Asistente"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative max-w-[70%] ml-3">
                <div className="p-3 rounded-2xl bg-gray-200">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "400ms" }}
                    ></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-200" />
              </div>
            </div>
          )}
        </div>
        <div className="flex mt-4">
          <Input
            className="flex-grow"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPressMessage}
            placeholder="Haz una pregunta sobre mi experiencia laboral..."
          />
          <Button onClick={sendMessage} className="ml-2">
            Enviar
          </Button>
        </div>
      </div>
    </>
  );
}
