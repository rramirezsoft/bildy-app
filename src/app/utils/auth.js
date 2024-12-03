export default function getToken() {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bytoken="))
      ?.split("=")[1];
  
    return token || null;
  }