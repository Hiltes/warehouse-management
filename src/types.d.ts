// src/types.d.ts
declare namespace App {
    // Rozszerzenie typu Locals o 'user'
    interface Locals {
        user: { username: string; password: string; email: string } | null;
    }
}
