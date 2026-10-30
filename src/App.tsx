import { useEffect, useState, type FormEvent } from 'react'

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" />
  </svg>
)

function useScrollEffects() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -12% 0px' },
    )

    const observeElements = () => {
      document.querySelectorAll('[data-reveal]:not(.is-observed)').forEach((element) => {
        element.classList.add('is-observed')
        observer.observe(element)
      })
    }

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      document.documentElement.style.setProperty('--scroll-progress', `${Math.min(progress, 1)}`)
    }

    observeElements()
    updateProgress()

    const mutationObserver = new MutationObserver(observeElements)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])
}

function useSmoothAnchorNavigation() {
  useEffect(() => {
    let animationFrame = 0

    const scrollToTarget = (hash: string) => {
      const target = document.getElementById(decodeURIComponent(hash.replace('#', '')))
      if (!target) return

      cancelAnimationFrame(animationFrame)
      const start = window.scrollY
      const destination = target.getBoundingClientRect().top + window.scrollY
      const distance = destination - start
      const duration = Math.min(1800, Math.max(750, Math.abs(distance) * 0.45))
      const startedAt = performance.now()

      const animate = (now: number) => {
        const elapsed = Math.min((now - startedAt) / duration, 1)
        const eased =
          elapsed < 0.5
            ? 4 * elapsed * elapsed * elapsed
            : 1 - Math.pow(-2 * elapsed + 2, 3) / 2

        window.scrollTo(0, start + distance * eased)

        if (elapsed < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    const pendingTarget = sessionStorage.getItem('llinas-scroll-target')
    if (pendingTarget) {
      sessionStorage.removeItem('llinas-scroll-target')
      requestAnimationFrame(() => scrollToTarget(pendingTarget))
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin || !url.hash) return

      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
      const destinationPath = url.pathname.replace(/\/+$/, '') || '/'

      if (currentPath !== destinationPath) {
        if (destinationPath === '/') {
          event.preventDefault()
          sessionStorage.setItem('llinas-scroll-target', url.hash)
          window.location.href = '/'
        }
        return
      }

      if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return

      event.preventDefault()
      window.history.pushState(null, '', url.hash)
      scrollToTarget(url.hash)
    }

    document.addEventListener('click', handleAnchorClick)
    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])
}

const ScrollProgress = () => <div className="scroll-progress" aria-hidden="true" />

const services = [
  {
    number: '01',
    title: 'Movimiento de tierras',
    text: 'Excavaciones, nivelaciones y preparación de terrenos para proyectos de cualquier escala.',
  },
  {
    number: '02',
    title: 'Obra civil',
    text: 'Ejecución precisa de canalizaciones, cimentaciones y urbanización de espacios.',
  },
  {
    number: '03',
    title: 'Paisajismo',
    text: 'Modelado del terreno, drenajes y preparación de espacios exteriores y jardines.',
  },
  {
    number: '04',
    title: 'Transportes',
    text: 'Logística de áridos, tierras y maquinaria con una flota preparada para cada obra.',
  },
  {
    number: '05',
    title: 'Venta de tierra',
    text: 'Suministro de tierra vegetal y áridos seleccionados para construcción y jardinería.',
  },
]

const advantages = [
  {
    number: '01',
    title: 'Adaptación',
    text: 'Adaptamos nuestro trabajo a las necesidades concretas de cada cliente y cada terreno.',
  },
  {
    number: '02',
    title: 'Cercanía',
    text: 'Trabajamos mano a mano con nuestros clientes durante todas las fases de su proyecto.',
  },
  {
    number: '03',
    title: 'Experiencia',
    text: 'Más de 25 años de experiencia en el sector avalan nuestra manera de hacer las cosas.',
  },
]

const machines = [
  {
    name: 'Excavadora de cadenas',
    image: 'https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Flota de excavación',
    image: 'https://images.unsplash.com/photo-1642927778267-4e8b787b325a?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Excavadora hidráulica',
    image: 'https://images.unsplash.com/photo-1649807479468-40011b31ee09?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Maquinaria de obra',
    image: 'https://images.unsplash.com/photo-1652396669401-db1bc4c4457d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Equipo compacto',
    image: 'https://images.unsplash.com/photo-1649034872337-feaa751786ae?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Bulldozer de nivelación',
    image: 'https://images.unsplash.com/photo-1652303713917-2666b8bee507?auto=format&fit=crop&w=1000&q=85',
  },
]

const projects = [
  {
    title: 'Adecuación de terreno',
    place: 'Santa Maria del Camí',
    image:
      'https://images.unsplash.com/photo-1764422743505-97c9ea0e43f2?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Gestión de áridos',
    place: 'Illes Balears',
    image:
      'https://images.unsplash.com/photo-1709489662983-3674d790b224?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Excavación técnica',
    place: 'Mallorca',
    image:
      'https://images.unsplash.com/photo-1659462391060-f9808509ca6a?auto=format&fit=crop&w=1400&q=85',
  },
]

const galleryItems = [
  {
    title: 'Excavación para cimentación',
    category: 'En proceso',
    service: 'Movimiento de tierras',
    image: 'https://images.unsplash.com/photo-1764422743505-97c9ea0e43f2?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Preparación de parcela',
    category: 'Finalizado',
    service: 'Obra civil',
    image: 'https://images.unsplash.com/photo-1709489662983-3674d790b224?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Nivelación del terreno',
    category: 'Finalizado',
    service: 'Movimiento de tierras',
    image: 'https://images.unsplash.com/photo-1659462391060-f9808509ca6a?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Excavación de zanja',
    category: 'En proceso',
    service: 'Obra civil',
    image: 'https://images.unsplash.com/photo-1785484267483-a61168355677?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Carga y transporte de tierra',
    category: 'En proceso',
    service: 'Transportes',
    image: 'https://images.unsplash.com/photo-1780054984787-b7e47746f5e0?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Adecuación de acceso',
    category: 'Finalizado',
    service: 'Paisajismo',
    image: 'https://images.unsplash.com/photo-1783853414502-5f5d13ee2057?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Demolición y retirada',
    category: 'En proceso',
    service: 'Obra civil',
    image: 'https://images.unsplash.com/photo-1788512287800-fb174b1c79aa?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Movimiento de áridos',
    category: 'Finalizado',
    service: 'Venta de tierra',
    image: 'https://images.unsplash.com/photo-1788058539956-306a09fdceef?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Trabajo nocturno',
    category: 'En proceso',
    service: 'Movimiento de tierras',
    image: 'https://images.unsplash.com/photo-1761504537447-e39a3085d697?auto=format&fit=crop&w=1400&q=85',
  },
]

function GalleryPage() {
  const [filter, setFilter] = useState('Todos')
  const visibleItems = filter === 'Todos' ? galleryItems : galleryItems.filter((item) => item.category === filter)

  return (
    <main className="min-h-screen bg-[#f5f4f1] text-[#333233]">
      <ScrollProgress />
      <header className="bg-[#333233] text-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:h-24 lg:px-14">
          <a href="/#inicio" className="group flex items-center gap-3" aria-label="Llinas Excavacions i Serveis, inicio">
            <span className="grid size-10 place-items-center bg-[#E0B45C] text-[#333233] transition-transform group-hover:rotate-6">
              <svg viewBox="0 0 40 40" className="size-8" fill="none" aria-hidden="true">
                <path d="M6 28 19 9h7L14 28H6Zm10 0L28 10h6L23 28h-7Z" fill="currentColor" />
              </svg>
            </span>
            <span>
              <strong className="block font-display text-[1.5rem] leading-none tracking-[.08em]">LLINAS</strong>
              <span className="mt-1 block text-[.58rem] font-bold uppercase tracking-[.27em] text-white/65">
                Excavacions i Serveis SL
              </span>
            </span>
          </a>
          <a href="/#proyectos" className="group flex items-center gap-3 text-xs font-extrabold uppercase tracking-[.15em]">
            <Arrow className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </a>
        </div>
      </header>

      <section className="bg-[#4F81C2] px-5 py-20 text-white md:px-10 lg:px-14 lg:py-28">
        <div className="mx-auto grid max-w-[1330px] gap-10 lg:grid-cols-12 lg:items-end">
          <div data-reveal="left" className="lg:col-span-8">
            <p className="section-label text-[#E0B45C]">Galería de proyectos</p>
            <h1 className="mt-7 font-display text-[clamp(4.2rem,9vw,9rem)] uppercase leading-[.78] tracking-[-.045em]">
              Nuestros<br />trabajos
            </h1>
          </div>
          <p data-reveal className="max-w-md text-base leading-7 text-white/75 lg:col-span-4">
            Una selección de obras finalizadas y proyectos en curso que muestran nuestra forma de trabajar sobre el terreno.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:px-14 lg:py-24">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#333233]/20 pb-7 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-extrabold uppercase tracking-[.18em]">
            {visibleItems.length.toString().padStart(2, '0')} proyectos
          </p>
          <div className="flex flex-wrap gap-2" aria-label="Filtrar proyectos">
            {['Todos', 'Finalizado', 'En proceso'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`border px-5 py-3 text-[.65rem] font-extrabold uppercase tracking-[.15em] transition ${
                  filter === option
                    ? 'border-[#4F81C2] bg-[#4F81C2] text-white'
                    : 'border-[#333233]/25 bg-transparent hover:border-[#333233]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="stagger-reveal grid auto-rows-[280px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item, index) => (
            <article
              key={item.title}
              data-reveal
              className={`group relative overflow-hidden bg-[#333233] ${
                index % 5 === 0 ? 'md:row-span-2' : ''
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#333233]/95 via-[#333233]/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 text-white transition-transform duration-300 group-hover:translate-y-0">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-7 bg-[#E0B45C]" />
                  <span className="text-[.62rem] font-extrabold uppercase tracking-[.16em] text-[#E0B45C]">
                    {item.category}
                  </span>
                </div>
                <h2 className="font-display text-3xl uppercase leading-none">{item.title}</h2>
                <p className="mt-2 text-xs text-white/60">{item.service}</p>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-16 flex flex-col items-start justify-between gap-7 border-t border-[#333233]/20 pt-10 md:flex-row md:items-center">
          <div>
            <p className="section-label text-[#4F81C2]">¿Tienes un proyecto?</p>
            <h2 className="mt-4 font-display text-4xl uppercase md:text-5xl">Hagamos realidad el siguiente</h2>
          </div>
          <a
            href="/contacto"
            className="group flex items-center gap-5 bg-[#333233] px-7 py-5 text-xs font-extrabold uppercase tracking-[.15em] text-white transition hover:bg-[#4F81C2]"
          >
            Solicitar presupuesto
            <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </main>
  )
}

function ContactPage({ initialService }: { initialService: string }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = `Solicitud de presupuesto — ${data.get('servicio') || 'Consulta general'}`
    const body = [
      `Nombre: ${data.get('nombre')}`,
      `Email: ${data.get('email')}`,
      `Teléfono: ${data.get('telefono')}`,
      `Servicio: ${data.get('servicio')}`,
      '',
      `${data.get('mensaje')}`,
    ].join('\n')

    window.location.href = `mailto:excavacionsllinas@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <main className="min-h-screen bg-[#f5f4f1] text-[#333233]">
      <ScrollProgress />
      <header className="bg-[#333233] text-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:h-24 lg:px-14">
          <a href="/#inicio" className="group flex items-center gap-3" aria-label="Llinas Excavacions i Serveis, inicio">
            <span className="grid size-10 place-items-center bg-[#E0B45C] text-[#333233] transition-transform group-hover:rotate-6">
              <svg viewBox="0 0 40 40" className="size-8" fill="none" aria-hidden="true">
                <path d="M6 28 19 9h7L14 28H6Zm10 0L28 10h6L23 28h-7Z" fill="currentColor" />
              </svg>
            </span>
            <span>
              <strong className="block font-display text-[1.5rem] leading-none tracking-[.08em]">LLINAS</strong>
              <span className="mt-1 block text-[.58rem] font-bold uppercase tracking-[.27em] text-white/65">
                Excavacions i Serveis SL
              </span>
            </span>
          </a>
          <a href="/#inicio" className="group flex items-center gap-3 text-xs font-extrabold uppercase tracking-[.15em]">
            <Arrow className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] lg:min-h-[calc(100vh-6rem)] lg:grid-cols-12">
        <div data-reveal="left" className="bg-[#4F81C2] px-5 py-16 text-white md:px-10 lg:col-span-5 lg:px-14 lg:py-24">
          <p className="section-label text-[#E0B45C]">Contacto</p>
          <h1 className="mt-8 font-display text-[clamp(4rem,7vw,7.5rem)] uppercase leading-[.82] tracking-[-.04em]">
            Cuéntanos tu proyecto
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-white/75">
            Explícanos qué necesitas y prepararemos una propuesta adaptada al terreno, los plazos y el alcance de tu obra.
          </p>

          <div className="mt-16 border-t border-white/25 pt-8">
            <p className="text-[.65rem] font-extrabold uppercase tracking-[.2em] text-[#E0B45C]">Contacto directo</p>
            <a href="tel:+34649003118" className="mt-5 block font-display text-4xl">+34 649 003 118</a>
            <a href="mailto:excavacionsllinas@gmail.com" className="mt-2 block text-sm text-white/70 hover:text-white">
              excavacionsllinas@gmail.com
            </a>
            <p className="mt-8 text-sm leading-6 text-white/65">
              Camí des Raiguer, 94<br />
              07320 Santa Maria del Camí, Illes Balears
            </p>
          </div>
        </div>

        <div data-reveal className="px-5 py-16 md:px-10 lg:col-span-7 lg:px-16 lg:py-24">
          <div className="mb-10 flex items-center justify-between border-b border-[#333233]/15 pb-6">
            <div>
              <p className="text-[.65rem] font-extrabold uppercase tracking-[.2em] text-[#4F81C2]">Solicitud de presupuesto</p>
              <h2 className="mt-2 font-display text-4xl uppercase">Datos del proyecto</h2>
            </div>
            <span className="hidden font-display text-6xl text-[#E0B45C] md:block">01</span>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-x-6 gap-y-7 md:grid-cols-2">
            <label className="form-field">
              <span>Nombre y apellidos *</span>
              <input name="nombre" type="text" required placeholder="Tu nombre" />
            </label>
            <label className="form-field">
              <span>Teléfono *</span>
              <input name="telefono" type="tel" required placeholder="+34 600 000 000" />
            </label>
            <label className="form-field">
              <span>Email *</span>
              <input name="email" type="email" required placeholder="tu@email.com" />
            </label>
            <label className="form-field">
              <span>Tipo de servicio *</span>
              <select name="servicio" required defaultValue={initialService}>
                <option value="" disabled>Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.number} value={service.title}>{service.title}</option>
                ))}
                <option value="Otro">Otro / Consulta general</option>
              </select>
            </label>
            <label className="form-field md:col-span-2">
              <span>Cuéntanos sobre tu proyecto *</span>
              <textarea
                name="mensaje"
                required
                rows={5}
                placeholder="Ubicación, tipo de terreno, dimensiones aproximadas, fechas..."
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="group flex w-full items-center justify-between bg-[#333233] px-7 py-5 text-left text-xs font-extrabold uppercase tracking-[.16em] text-white transition hover:bg-[#4F81C2] md:w-auto md:min-w-72"
              >
                Enviar solicitud
                <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 max-w-xl text-xs leading-5 text-[#777477]">
                Al enviar se abrirá tu aplicación de correo con los datos de la solicitud preparados.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  useScrollEffects()
  useSmoothAnchorNavigation()
  const currentPath = window.location.pathname.replace(/\/+$/, '')
  const isContactPage = currentPath === '/contacto'
  const isGalleryPage = currentPath === '/trabajos'
  const selectedService = new URLSearchParams(window.location.search).get('servicio') ?? ''

  if (isContactPage) {
    return <ContactPage initialService={selectedService} />
  }

  if (isGalleryPage) {
    return <GalleryPage />
  }

  return (
    <main className="overflow-hidden bg-white text-[#333233]">
      <ScrollProgress />
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/20 text-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10 lg:h-24 lg:px-14">
          <a href="#inicio" className="group flex items-center gap-3" aria-label="Llinas Excavacions i Serveis, inicio">
            <span className="grid size-10 place-items-center bg-[#E0B45C] text-[#333233] transition-transform group-hover:rotate-6">
              <svg viewBox="0 0 40 40" className="size-8" fill="none" aria-hidden="true">
                <path d="M6 28 19 9h7L14 28H6Zm10 0L28 10h6L23 28h-7Z" fill="currentColor" />
              </svg>
            </span>
            <span>
              <strong className="block font-display text-[1.5rem] leading-none tracking-[.08em]">LLINAS</strong>
              <span className="mt-1 block text-[.58rem] font-bold uppercase tracking-[.27em] text-white/65">
                Excavacions i Serveis SL
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-[.64rem] font-bold uppercase tracking-[.12em] lg:flex">
            <a className="nav-link" href="#inicio">Inicio</a>
            <a className="nav-link" href="#empresa">Quiénes somos</a>
            <a className="nav-link" href="#maquinaria">Nuestras máquinas</a>
            <a className="nav-link" href="#servicios">Servicios</a>
            <a className="nav-link" href="#proyectos">Nuestros trabajos</a>
          </nav>

          <a
            href="/contacto"
            className="hidden items-center gap-3 bg-[#E0B45C] px-5 py-3 text-xs font-extrabold uppercase tracking-[.13em] text-[#333233] transition hover:bg-white lg:flex"
          >
            Solicitar presupuesto <Arrow className="size-4" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid size-11 place-items-center border border-white/35 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/20 bg-[#333233] px-5 py-6 lg:hidden">
            {[
              ['Inicio', 'inicio'],
              ['Quiénes somos', 'empresa'],
              ['Nuestras máquinas', 'maquinaria'],
              ['Servicios', 'servicios'],
              ['Nuestros trabajos', 'proyectos'],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/10 py-4 font-display text-2xl uppercase"
              >
                {label}
              </a>
            ))}
            <a href="/contacto" className="block border-b border-white/10 py-4 font-display text-2xl uppercase">
              Contacto
            </a>
          </nav>
        )}
      </header>

      <section id="inicio" className="relative min-h-[760px] bg-[#333233] lg:min-h-[880px]">
        <img
          src="https://images.unsplash.com/photo-1768053823555-b75cd4ead6c4?auto=format&fit=crop&w=2200&q=90"
          alt="Pala de excavadora trabajando bajo un cielo azul"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(51,50,51,.96)_0%,rgba(51,50,51,.72)_46%,rgba(51,50,51,.12)_100%)]" />
        <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] items-end px-5 pb-16 pt-36 md:px-10 lg:min-h-[880px] lg:px-14 lg:pb-24">
          <div data-reveal="left" className="max-w-5xl">
            <div className="mb-7 flex items-center gap-4 text-[#E0B45C]">
              <span className="h-px w-12 bg-current" />
              <span className="text-xs font-extrabold uppercase tracking-[.24em]">Construimos desde la base</span>
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(4.2rem,10vw,9.4rem)] font-semibold uppercase leading-[.78] tracking-[-.045em] text-white">
              Movemos
              <span className="block text-[#E0B45C]">el futuro</span>
            </h1>
            <div className="mt-9 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-base leading-7 text-white/72 md:text-lg">
                Soluciones integrales de excavación, obra civil y transporte.
                Rigor técnico, maquinaria propia y compromiso en cada terreno.
              </p>
              <a href="#servicios" className="group flex shrink-0 items-center gap-4 text-xs font-extrabold uppercase tracking-[.17em] text-white">
                Descubre lo que hacemos
                <span className="grid size-12 place-items-center rounded-full border border-white/40 transition group-hover:border-[#E0B45C] group-hover:bg-[#E0B45C] group-hover:text-[#333233]">
                  <Arrow className="size-5 rotate-90" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div data-reveal className="absolute bottom-0 right-0 hidden w-[32%] grid-cols-2 bg-[#4F81C2] text-white md:grid">
          <div className="border-r border-white/25 p-6 lg:p-8">
            <strong className="font-display text-5xl leading-none lg:text-6xl">25+</strong>
            <span className="mt-2 block text-[.65rem] font-extrabold uppercase tracking-[.18em]">Años de experiencia</span>
          </div>
          <div className="p-6 lg:p-8">
            <strong className="font-display text-5xl leading-none lg:text-6xl">360º</strong>
            <span className="mt-2 block text-[.65rem] font-extrabold uppercase tracking-[.18em]">Servicio integral</span>
          </div>
        </div>
      </section>

      <section id="empresa" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-10 lg:grid-cols-12 lg:px-14 lg:py-36">
        <div data-reveal="left" className="lg:col-span-4">
          <p className="section-label">Quiénes somos</p>
          <div className="mt-10 hidden h-px w-full bg-[#333233]/20 lg:block" />
        </div>
        <div data-reveal className="lg:col-span-8">
          <h2 className="font-display text-[clamp(3.2rem,6.5vw,6.8rem)] uppercase leading-[.88] tracking-[-.035em]">
            Precisión en cada
            <span className="block text-[#4F81C2]">metro de terreno.</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <p className="text-lg leading-8">
              Somos un equipo especializado en transformar el terreno con solvencia, planificación y una ejecución impecable.
            </p>
            <div>
              <p className="leading-7 text-[#686668]">
                Acompañamos a particulares, constructoras y administraciones desde el estudio inicial hasta la entrega final, coordinando cada fase para evitar imprevistos.
              </p>
              <a href="#contacto" className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#333233] pb-2 text-xs font-extrabold uppercase tracking-[.16em]">
                Conócenos mejor <Arrow className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div id="maquinaria" className="mt-12 min-w-0 scroll-mt-8 lg:col-span-12 lg:mt-24">
          <div data-reveal className="mb-8 flex flex-col justify-between gap-5 border-t border-[#333233]/20 pt-8 md:flex-row md:items-end">
            <div>
              <p className="section-label text-[#4F81C2]">Nuestra maquinaria</p>
              <h3 className="mt-4 font-display text-4xl uppercase md:text-6xl">Preparados para cada terreno</h3>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#686668]">
              Una flota versátil y mantenida para trabajar con precisión, seguridad y rendimiento.
            </p>
          </div>

          <div className="machine-carousel">
            <div className="machine-track">
              {[false, true].map((duplicate) => (
                <div key={duplicate ? 'duplicate' : 'original'} className="machine-set" aria-hidden={duplicate || undefined}>
                  {machines.map((machine, index) => (
                    <figure key={`${duplicate}-${machine.name}`} className="machine-card">
                      <img src={machine.image} alt={duplicate ? '' : machine.name} />
                      <figcaption>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {machine.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ventajas" className="border-y border-[#333233]/15 bg-[#f5f4f1] py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="section-label text-[#4F81C2]">Nuestras ventajas</p>
              <h2 className="mt-6 font-display text-[clamp(3.7rem,6vw,6.5rem)] uppercase leading-[.86] tracking-[-.035em]">
                La confianza se construye trabajando
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-[#686668] lg:col-span-5 lg:col-start-8">
              Nos encargamos de desarrollar cada proyecto a medida, combinando atención directa, capacidad de respuesta y conocimiento técnico.
            </p>
          </div>

          <div className="mt-16 grid border-l border-t border-[#333233]/20 md:grid-cols-3">
            {advantages.map((advantage) => (
              <article
                key={advantage.number}
                data-reveal
                className="group min-h-[310px] border-b border-r border-[#333233]/20 bg-white p-8 transition-colors hover:bg-[#E0B45C] lg:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-xl text-[#4F81C2] transition-colors group-hover:text-[#333233]">
                    {advantage.number}
                  </span>
                  <span className="h-px w-12 bg-[#333233]/30 transition-all group-hover:w-20 group-hover:bg-[#333233]" />
                </div>
                <h3 className="mt-20 font-display text-4xl uppercase">{advantage.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-[#686668] transition-colors group-hover:text-[#333233]/75">
                  {advantage.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-[#333233] py-24 text-white lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
          <div data-reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="section-label text-[#E0B45C] before:bg-[#E0B45C]">Servicios</p>
              <h2 className="mt-6 font-display text-[clamp(3.5rem,7vw,7rem)] uppercase leading-[.85] tracking-[-.035em]">Servicios que<br />ofrecemos</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/55">
              Recursos propios y profesionales experimentados para resolver proyectos complejos con agilidad.
            </p>
          </div>

          <div className="stagger-reveal border-t border-white/20">
            {services.map((service) => (
              <article key={service.number} data-reveal className="group grid gap-4 border-b border-white/20 py-8 transition-colors hover:bg-white/[.035] md:grid-cols-12 md:items-center md:py-10">
                <span className="font-display text-xl text-[#E0B45C] md:col-span-1">{service.number}</span>
                <h3 className="font-display text-4xl uppercase leading-none md:col-span-5 md:text-5xl lg:text-6xl">{service.title}</h3>
                <p className="max-w-md text-sm leading-6 text-white/55 md:col-span-4">{service.text}</p>
                <div className="flex justify-end md:col-span-2">
                  <a
                    href={`/contacto?servicio=${encodeURIComponent(service.title)}`}
                    aria-label={`Solicitar presupuesto de ${service.title}`}
                    className="grid size-12 place-items-center rounded-full border border-white/25 transition group-hover:rotate-[-45deg] group-hover:border-[#E0B45C] group-hover:bg-[#E0B45C] group-hover:text-[#333233]"
                  >
                    <Arrow className="size-5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proyectos" className="py-24 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
          <div data-reveal className="mb-14 flex items-end justify-between">
            <div>
              <p className="section-label">Trabajos realizados</p>
              <h2 className="mt-6 font-display text-[clamp(3.7rem,7vw,7rem)] uppercase leading-[.85] tracking-[-.035em]">Trabajo sobre<br />el terreno</h2>
            </div>
            <a
              href="/trabajos"
              className="group flex items-center gap-4 border-b-2 border-[#333233] pb-2 text-xs font-extrabold uppercase tracking-[.16em]"
            >
              Ver todos los trabajos
              <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="stagger-reveal grid gap-5 md:grid-cols-12">
            {projects.map((project, index) => (
              <article key={project.title} data-reveal className={`group relative min-h-[440px] overflow-hidden ${index === 0 ? 'md:col-span-6 md:min-h-[620px]' : 'md:col-span-3 md:min-h-[620px]'}`}>
                <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111b18]/90 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="mb-2 text-[.65rem] font-bold uppercase tracking-[.18em] text-[#E0B45C]">{project.place}</p>
                  <h3 className="font-display text-3xl uppercase leading-none lg:text-4xl">{project.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[650px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1759783050279-c9e8cc4f910d?auto=format&fit=crop&w=2000&q=85"
          alt="Excavadora trabajando en una cantera de roca"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#333233]/70" />
        <div className="relative mx-auto flex min-h-[650px] max-w-[1440px] items-center px-5 py-24 md:px-10 lg:px-14">
          <div data-reveal="left" className="max-w-4xl text-white">
            <p className="section-label text-[#E0B45C] before:bg-[#E0B45C]">Nuestra manera de trabajar</p>
            <blockquote className="mt-8 font-display text-[clamp(3.1rem,6vw,6.6rem)] uppercase leading-[.9] tracking-[-.03em]">
              “La fuerza está en la máquina. La diferencia, en quien la dirige.”
            </blockquote>
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-[#4F81C2] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-12">
          <div data-reveal="left" className="px-5 py-20 md:px-10 lg:col-span-8 lg:px-14 lg:py-28">
            <p className="section-label">Hablemos de tu proyecto</p>
            <h2 className="mt-7 max-w-4xl font-display text-[clamp(4rem,8vw,8.5rem)] uppercase leading-[.8] tracking-[-.04em]">
              ¿Movemos tierra?
            </h2>
            <a href="/contacto" className="mt-12 inline-flex items-center gap-5 border-b-[3px] border-white pb-3 text-sm font-extrabold uppercase tracking-[.16em]">
              Pide tu presupuesto <Arrow className="size-5" />
            </a>
          </div>
          <div data-reveal className="flex flex-col justify-between bg-[#333233] p-8 text-white md:p-12 lg:col-span-4">
            <div>
              <p className="text-[.65rem] font-bold uppercase tracking-[.2em] text-[#E0B45C]">Contacto directo</p>
              <a href="tel:+34649003118" className="mt-6 block font-display text-4xl uppercase">+34 649 003 118</a>
              <a href="mailto:excavacionsllinas@gmail.com" className="mt-2 block text-white/60 hover:text-white">excavacionsllinas@gmail.com</a>
            </div>
            <div className="mt-16 border-t border-white/15 pt-7 text-sm leading-6 text-white/55">
              <p>Camí des Raiguer, 94<br />07320 Santa Maria del Camí, Illes Balears</p>
              <p className="mt-5">Horario de atención<br />Todos los días / 08:00 — 20:00</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#292829] px-5 py-8 text-white/45 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1330px] flex-col justify-between gap-4 text-[.65rem] font-bold uppercase tracking-[.14em] md:flex-row">
          <p>© 2025 Llinas Excavacions i Serveis SL. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
