import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h1 className="card-title text-3xl">Welcome 👋</h1>
            <p className="opacity-80">
              Ini adalah demo IMP Assessment. Gunakan tombol di bawah untuk menjelajah
              daftar posting atau melakukan autentikasi sebelum membuat/mengubah data.
            </p>
            <div className="card-actions justify-start mt-2">
              <Link href="/posts" className="btn btn-primary">Lihat Posts</Link>
              <Link href="/auth/sign-in" className="btn btn-outline">Sign In</Link>
              <Link href="/auth/sign-up" className="btn">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
