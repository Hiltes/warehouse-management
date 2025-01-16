// src/types.d.ts
declare namespace App {
    // Rozszerzenie typu Locals o 'user'
    interface Locals {
        user: { username: string; password: string; email: string,role:string } | null;
        client: { username:string; password: string; email: string,role:string } | null;
    }
}
