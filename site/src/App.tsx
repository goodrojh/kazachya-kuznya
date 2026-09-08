import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from 'react'
import {
  ADVANTAGES,
  CATEGORIES,
  CONTACTS,
  DELIVERY,
  FAQ,
  HERO_BARS,
  NAV,
  PRODUCTS,
  PRODUCT_FILTERS,
  REVIEWS,
  SOCIALS,
  SPECS,
  img,
  type SocialKey,
} from './data'

/* ------------------------------------------------------------------ *
 * Общие хелперы
 * ------------------------------------------------------------------ */

const HERO_IMAGE = img('forge-1')
const PRODUCTION_IMAGE = img('forge-2')

const rub = (n: number) => n.toLocaleString('ru-RU') + ' ₽'
const discount = (price: number, old: number) => Math.round((1 - price / old) * 100)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ *
 * Хуки
 * ------------------------------------------------------------------ */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    setIsMobile(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

/** Появление блоков по мере скролла, со сдвигом по индексу. */
function useStaggeredReveal(threshold = 0.12) {
  const containerRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (prefersReducedMotion()) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  const getAnimStyle = useCallback(
    (index: number): CSSProperties => ({
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(26px)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 90}ms`,
    }),
    [visible],
  )

  return { containerRef, getAnimStyle, visible }
}

type MaskPosition = { x: number; y: number; sw: number; sh: number }

/**
 * Считает смещение каждой карточки внутри секции, чтобы через все карточки
 * читалось одно общее фоновое изображение.
 */
function useMaskPositions(
  sectionRef: React.RefObject<HTMLElement | null>,
  cardRefs: React.MutableRefObject<(HTMLElement | null)[]>,
  count: number,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const measure = () => {
      const s = section.getBoundingClientRect()
      const next: MaskPosition[] = []
      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i]
        if (!card) {
          next.push({ x: 0, y: 0, sw: s.width, sh: s.height })
          continue
        }
        const c = card.getBoundingClientRect()
        next.push({ x: c.left - s.left, y: c.top - s.top, sw: s.width, sh: s.height })
      }
      setPositions(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    cardRefs.current.forEach((c) => c && ro.observe(c))
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [sectionRef, cardRefs, count])

  return positions
}

type MaskLayout = { w: number; h: number; offX: number; offY: number }

/**
 * Габариты общего фона так, чтобы он гарантированно перекрывал секцию
 * («cover»), плюс смещение до точки интереса.
 */
function useMaskLayout(src: string, sw: number, sh: number, focalX: number): MaskLayout | null {
  const [natural, setNatural] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const image = new Image()
    image.src = src
    const onLoad = () => setNatural({ w: image.naturalWidth, h: image.naturalHeight })
    if (image.complete && image.naturalHeight) onLoad()
    else image.addEventListener('load', onLoad)
    return () => image.removeEventListener('load', onLoad)
  }, [src])

  if (!natural.w || !natural.h || !sw || !sh) return null

  const scale = Math.max(sw / natural.w, sh / natural.h)
  const w = natural.w * scale
  const h = natural.h * scale
  return {
    w,
    h,
    offX: (w - sw) * focalX,
    offY: (h - sh) * 0.5,
  }
}

/* ------------------------------------------------------------------ *
 * MaskedCard
 * ------------------------------------------------------------------ */

type MaskedCardProps = {
  bgImage: string
  position?: MaskPosition
  layout: MaskLayout | null
  className?: string
  style?: CSSProperties
  cardRef?: (el: HTMLDivElement | null) => void
  children?: ReactNode
}

function MaskedCard({ bgImage, position, layout, className = '', style, cardRef, children }: MaskedCardProps) {
  const bgStyle: CSSProperties =
    position && layout
      ? {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: `${layout.w}px ${layout.h}px`,
          backgroundPosition: `-${position.x + layout.offX}px -${position.y + layout.offY}px`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1A1A1E',
        }
      : { backgroundColor: '#1A1A1E' }

  return (
    <div ref={cardRef} className={className} style={{ ...bgStyle, ...style }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Мелкие примитивы
 * ------------------------------------------------------------------ */

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 7h12m0 0L8 2m5 5L8 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Иконки (инлайн, без внешних библиотек)
 * ------------------------------------------------------------------ */

type IconProps = { className?: string }

function IconWhatsApp({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.05 8.05 0 0 1-1.24-4.32c0-4.46 3.63-8.09 8.1-8.09Zm-2.4 4.15c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.97 2.62 1.11 2.8c.14.18 1.9 2.9 4.62 3.96.65.25 1.15.4 1.54.51.65.2 1.24.18 1.7.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.18-1.34-.8-.72-1.35-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.47-.83-2.01-.22-.53-.44-.46-.6-.46l-.52-.01Z" />
    </svg>
  )
}

function IconTelegram({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.3 18.9 19.1c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.33-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.98 13.02l-4.63-1.45c-1.01-.31-1.03-1 .21-1.49L20.64 2.9c.84-.31 1.57.19 1.3 1.4Z" />
    </svg>
  )
}

function IconVk({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.16 18.2c-6.05 0-9.83-4.15-9.98-11.03h3.05c.1 5.05 2.42 7.2 4.18 7.64V7.17h2.9v4.35c1.7-.19 3.48-2.19 4.08-4.35h2.86c-.46 2.65-2.4 4.65-3.77 5.48 1.37.67 3.58 2.42 4.43 5.55h-3.15c-.66-2.09-2.28-3.71-4.45-3.94v3.94h-.15Z" />
    </svg>
  )
}

function IconYoutube({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.52 2.52 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.83.42A2.52 2.52 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.52 2.52 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.83-.42a2.52 2.52 0 0 0 1.77-1.78C22 15.22 22 12 22 12s0-3.22-.4-4.8ZM10.05 15.02V8.98L15.3 12l-5.25 3.02Z" />
    </svg>
  )
}

/** Фирменный знак Авито — четыре круга. */
function IconAvito({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="7" cy="16.4" r="4.6" />
      <circle cx="17.6" cy="17.4" r="3.6" />
      <circle cx="9.3" cy="6" r="3.4" />
      <circle cx="18.4" cy="7.6" r="2.6" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<SocialKey, (p: IconProps) => JSX.Element> = {
  whatsapp: IconWhatsApp,
  telegram: IconTelegram,
  vk: IconVk,
  youtube: IconYoutube,
  avito: IconAvito,
}

function IconCart({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.5 3h2.2l2.2 11.2a1.8 1.8 0 0 0 1.77 1.45h8.06a1.8 1.8 0 0 0 1.77-1.42L20.2 6.9H6.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTrash({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 6.5h16M9.5 6.5V4.8c0-.5.4-.9.9-.9h3.2c.5 0 .9.4.9.9v1.7M6.5 6.5l.9 12.4c0 .6.5 1.1 1.1 1.1h7c.6 0 1.1-.5 1.1-1.1l.9-12.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Ряд иконок соцсетей и Авито. */
function SocialLinks({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
  const icon = size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5'
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {SOCIALS.map(({ key, label, href }) => {
        const Icon = SOCIAL_ICONS[key]
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={`flex ${box} items-center justify-center rounded-full border border-bone/20 text-bone/85 transition-colors duration-300 hover:border-brass hover:bg-brass hover:text-ink`}
          >
            <Icon className={icon} />
          </a>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Корзина
 * ------------------------------------------------------------------ */

const PRODUCT_BY_SKU = new Map(PRODUCTS.map((p) => [p.sku, p]))
const CART_STORAGE_KEY = 'kk-cart-v1'

type CartLine = { sku: string; qty: number }

type CartApi = {
  lines: CartLine[]
  count: number
  total: number
  oldTotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (sku: string) => void
  setQty: (sku: string, qty: number) => void
  remove: (sku: string) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)

function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart вызван вне CartProvider')
  return ctx
}

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((l) => l && typeof l.sku === 'string' && PRODUCT_BY_SKU.has(l.sku))
      .map((l) => ({ sku: l.sku as string, qty: Math.min(99, Math.max(1, Number(l.qty) || 1)) }))
  } catch {
    return []
  }
}

function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [lines])

  const api = useMemo<CartApi>(() => {
    const totals = lines.reduce(
      (acc, l) => {
        const p = PRODUCT_BY_SKU.get(l.sku)
        if (!p) return acc
        acc.count += l.qty
        acc.total += p.price * l.qty
        acc.oldTotal += p.oldPrice * l.qty
        return acc
      },
      { count: 0, total: 0, oldTotal: 0 },
    )

    return {
      lines,
      ...totals,
      open,
      setOpen,
      add: (sku: string) =>
        setLines((prev) => {
          const found = prev.find((l) => l.sku === sku)
          if (found) return prev.map((l) => (l.sku === sku ? { ...l, qty: Math.min(99, l.qty + 1) } : l))
          return [...prev, { sku, qty: 1 }]
        }),
      setQty: (sku: string, qty: number) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.sku !== sku)
            : prev.map((l) => (l.sku === sku ? { ...l, qty: Math.min(99, qty) } : l)),
        ),
      remove: (sku: string) => setLines((prev) => prev.filter((l) => l.sku !== sku)),
      clear: () => setLines([]),
    }
  }, [lines, open])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

/** Кнопка «В корзину» с подтверждением состояния. */
function AddToCartButton({ sku, className = '' }: { sku: string; className?: string }) {
  const cart = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const inCart = cart.lines.find((l) => l.sku === sku)

  useEffect(() => {
    if (!justAdded) return
    const t = setTimeout(() => setJustAdded(false), 1600)
    return () => clearTimeout(t)
  }, [justAdded])

  return (
    <button
      type="button"
      onClick={() => {
        cart.add(sku)
        setJustAdded(true)
      }}
      className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] md:h-12 md:text-sm ${
        justAdded
          ? 'bg-brass-light text-ink'
          : inCart
            ? 'border border-brass bg-brass/15 text-brass hover:bg-brass hover:text-ink'
            : 'bg-brass text-ink hover:bg-brass-light'
      } ${className}`}
    >
      {justAdded ? 'Добавлено' : inCart ? `В корзине · ${inCart.qty}` : 'В корзину'}
      {!justAdded && <IconCart className="h-4 w-4" />}
    </button>
  )
}

function QtyStepper({ sku, qty }: { sku: string; qty: number }) {
  const cart = useCart()
  return (
    <div className="flex items-center gap-1 rounded-full border border-bone/20">
      <button
        type="button"
        onClick={() => cart.setQty(sku, qty - 1)}
        aria-label="Уменьшить количество"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none text-bone transition-colors hover:text-brass"
      >
        −
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-bold tabular-nums text-bone">{qty}</span>
      <button
        type="button"
        onClick={() => cart.setQty(sku, qty + 1)}
        aria-label="Увеличить количество"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none text-bone transition-colors hover:text-brass"
      >
        +
      </button>
    </div>
  )
}

function CartDrawer() {
  const cart = useCart()
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '', delivery: DELIVERY[0], note: '' })

  const { open, setOpen, lines, count, total, oldTotal } = cart
  const saving = oldTotal - total

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  useEffect(() => {
    if (!open) setCheckout(false)
  }, [open])

  useEffect(() => {
    if (count === 0) setCheckout(false)
  }, [count])

  const canSend = form.name.trim().length > 1 && form.phone.trim().length > 4

  const submit = () => {
    const items = lines
      .map((l, i) => {
        const p = PRODUCT_BY_SKU.get(l.sku)
        if (!p) return ''
        return `${i + 1}. ${p.name} (арт. ${p.sku}) — ${l.qty} шт. × ${rub(p.price)}`
      })
      .filter(Boolean)
      .join('\n')

    const contacts = [
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
      form.city ? `Город: ${form.city}` : null,
      `Доставка: ${form.delivery}`,
      form.note ? `Комментарий: ${form.note}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    // Пустые строки между блоками — так заказ читается в чате.
    const text = ['Здравствуйте! Хочу оформить заказ:', items, `Итого: ${rub(total)}`, contacts].join('\n\n')

    window.open(`${CONTACTS.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const field =
    'w-full rounded-xl border border-bone/15 bg-ink px-4 py-3.5 text-base text-bone outline-none transition-colors duration-200 placeholder:text-ash/60 focus:border-brass'

  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Закрыть корзину"
        onClick={() => setOpen(false)}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/75 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-label="Корзина"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-bone/10 bg-coal shadow-2xl transition-transform duration-500 ease-drawer ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-bone/10 px-5 py-4 md:px-7 md:py-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-bone md:text-2xl">
              {checkout ? 'Оформление' : 'Корзина'}
            </h2>
            {count > 0 && <span className="text-sm font-semibold text-brass">{count}</span>}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть корзину"
            tabIndex={open ? 0 : -1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors hover:border-brass hover:text-brass"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <IconCart className="h-12 w-12 text-bone/25" />
            <p className="mt-5 font-display text-lg font-semibold uppercase tracking-wide text-bone">
              Ваша корзина пуста
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-ash">
              Перед оформлением заказа необходимо добавить товары в корзину.
            </p>
            <a
              href="#products"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-brass px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brass-light"
            >
              Продолжить покупки
              <Arrow />
            </a>
          </div>
        ) : checkout ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7">
              <p className="text-sm leading-6 text-ash">
                Оставьте контакты — заказ уйдёт нам в WhatsApp вместе со списком изделий, и мы подтвердим наличие,
                сроки и стоимость доставки.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Имя *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Как к вам обращаться"
                    autoComplete="name"
                    tabIndex={open ? 0 : -1}
                    className={field}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Телефон *</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    autoComplete="tel"
                    tabIndex={open ? 0 : -1}
                    className={field}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Город</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Куда отправить"
                    autoComplete="address-level2"
                    tabIndex={open ? 0 : -1}
                    className={field}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Доставка</span>
                  <select
                    value={form.delivery}
                    onChange={(e) => setForm({ ...form, delivery: e.target.value })}
                    tabIndex={open ? 0 : -1}
                    className={field}
                  >
                    {DELIVERY.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Комментарий</span>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Гравировка, индивидуальные размеры, пожелания"
                    tabIndex={open ? 0 : -1}
                    className={`${field} resize-none`}
                  />
                </label>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-ash">
                Доставка оплачивается отдельно согласно тарифу транспортной компании. Возможна оплата наличными,
                картой, переводом или наложенным платежом.
              </p>
            </div>

            <div className="shrink-0 border-t border-bone/10 px-5 py-4 md:px-7 md:py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-ash">Итого</span>
                <span className="font-display text-2xl font-bold text-bone">{rub(total)}</span>
              </div>
              <button
                type="button"
                disabled={!canSend}
                onClick={submit}
                tabIndex={open ? 0 : -1}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-brass px-6 py-4 text-sm font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-brass-light active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-bone/15 disabled:text-ash"
              >
                Отправить заказ
                <IconWhatsApp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCheckout(false)}
                tabIndex={open ? 0 : -1}
                className="mt-2 w-full py-3 text-xs font-bold uppercase tracking-wider text-ash transition-colors hover:text-bone"
              >
                Назад в корзину
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 md:px-7 md:py-5">
              <ul className="divide-y divide-bone/10">
                {lines.map((line) => {
                  const p = PRODUCT_BY_SKU.get(line.sku)
                  if (!p) return null
                  return (
                    <li key={line.sku} className="flex gap-3.5 py-4 first:pt-0 md:gap-4">
                      <img
                        src={img(p.image)}
                        alt={p.name}
                        loading="lazy"
                        width={160}
                        height={160}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover md:h-24 md:w-24"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brass">
                            {p.category} · {p.sku}
                          </span>
                          <h3 className="mt-1 text-sm font-bold leading-5 text-bone">{p.name}</h3>
                          <span className="mt-1 block text-xs text-ash">{rub(p.price)} за шт.</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <QtyStepper sku={line.sku} qty={line.qty} />
                          <div className="flex items-center gap-2">
                            <span className="font-display text-base font-bold tabular-nums text-bone">
                              {rub(p.price * line.qty)}
                            </span>
                            <button
                              type="button"
                              onClick={() => cart.remove(line.sku)}
                              aria-label={`Удалить: ${p.name}`}
                              tabIndex={open ? 0 : -1}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-ash transition-colors hover:bg-bone/5 hover:text-bone"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <button
                type="button"
                onClick={cart.clear}
                tabIndex={open ? 0 : -1}
                className="mt-5 text-xs font-semibold uppercase tracking-wider text-ash transition-colors hover:text-bone"
              >
                Очистить корзину
              </button>
            </div>

            <div className="shrink-0 border-t border-bone/10 px-5 py-4 md:px-7 md:py-5">
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-ash">
                  <dt>Товаров</dt>
                  <dd className="tabular-nums">{count} шт.</dd>
                </div>
                {saving > 0 && (
                  <div className="flex justify-between text-brass">
                    <dt>Ваша выгода</dt>
                    <dd className="tabular-nums">−{rub(saving)}</dd>
                  </div>
                )}
                <div className="mt-1 flex items-baseline justify-between border-t border-bone/10 pt-3">
                  <dt className="text-sm font-semibold uppercase tracking-wider text-bone">Итого</dt>
                  <dd className="font-display text-2xl font-bold tabular-nums text-bone">{rub(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setCheckout(true)}
                tabIndex={open ? 0 : -1}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-brass px-6 py-4 text-sm font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-brass-light active:scale-[0.98]"
              >
                Оформить заказ
                <Arrow />
              </button>
              <p className="mt-2.5 text-center text-[11px] leading-4 text-ash">
                Доставка рассчитывается отдельно по тарифу транспортной компании
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

/** Кнопка корзины со счётчиком. */
function CartButton({ className = '' }: { className?: string }) {
  const cart = useCart()
  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      aria-label={`Корзина, товаров: ${cart.count}`}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-300 hover:border-brass hover:text-brass ${className}`}
    >
      <IconCart className="h-5 w-5" />
      {cart.count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brass px-1 text-[10px] font-bold tabular-nums text-ink">
          {cart.count}
        </span>
      )}
    </button>
  )
}

function SectionLabel({ children, index }: { children: ReactNode; index: string }) {
  return (
    <div className="flex items-center gap-3 text-brass">
      <span className="font-display text-xs tracking-[0.3em]">{index}</span>
      <span className="h-px w-8 bg-brass/50" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] md:text-xs">{children}</span>
    </div>
  )
}

function PrimaryButton({
  href,
  children,
  className = '',
  external = false,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group/btn inline-flex items-center justify-center gap-2.5 rounded-full bg-brass px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-brass-light active:scale-[0.98] md:px-8 md:py-4 ${className}`}
    >
      {children}
      <Arrow className="transition-transform duration-300 group-hover/btn:translate-x-1" />
    </a>
  )
}

function GhostButton({
  href,
  children,
  className = '',
  external = false,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full border border-bone/25 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-bone transition-all duration-300 hover:border-brass hover:text-brass active:scale-[0.98] md:px-8 md:py-4 ${className}`}
    >
      {children}
    </a>
  )
}

/* ------------------------------------------------------------------ *
 * Splash
 * ------------------------------------------------------------------ */

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(100)
      const t = setTimeout(onComplete, 300)
      return () => clearTimeout(t)
    }
    const DURATION = 1800
    const start = performance.now()
    let raf = 0
    let done = false

    const finish = () => {
      if (done) return
      done = true
      setCount(100)
      setExiting(true)
      setTimeout(onComplete, 700)
    }

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(finish, 180)
    }
    raf = requestAnimationFrame(tick)

    // Страховка: вкладка в фоне тормозит таймеры — не держим экран дольше 3 с.
    const guard = setTimeout(finish, 3000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(guard)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-ink transition-opacity duration-700 ${exiting ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <div className="flex h-full w-full flex-col justify-between p-6 md:p-10">
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-bone md:text-3xl">
            Казачья
          </span>
          <span className="-mt-1 font-display text-2xl font-bold uppercase leading-none tracking-tight text-brass md:text-3xl">
            Кузня
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="font-display text-7xl font-bold leading-none tabular-nums text-bone md:text-9xl">
            {count}
          </span>
          <span className="mb-2 max-w-[45%] text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-ash md:mb-4 md:text-xs">
            Традиции · Качество · Надёжность
          </span>
        </div>

        <div className="absolute bottom-0 left-0 h-0.5 bg-brass transition-[width] duration-100 ease-linear" style={{ width: `${count}%` }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Navbar
 * ------------------------------------------------------------------ */

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-bone/10 bg-ink/85 backdrop-blur-xl' : 'border-b border-transparent bg-gradient-to-b from-ink/80 to-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="Казачья Кузня — на главную">
            <span className="flex flex-col">
              <span className="font-display text-lg font-bold uppercase leading-none tracking-tight text-bone md:text-xl">
                Казачья
              </span>
              <span className="-mt-0.5 font-display text-lg font-bold uppercase leading-none tracking-tight text-brass md:text-xl">
                Кузня
              </span>
            </span>
            <span className="hidden text-[8px] font-semibold uppercase leading-tight tracking-[0.18em] text-ash lg:block">
              традиции
              <br />
              качество
              <br />
              надёжность
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-sm font-semibold text-bone/80 transition-colors duration-200 hover:text-brass after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brass after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={CONTACTS.phoneHref}
              className="hidden py-2 text-sm font-bold text-bone transition-colors hover:text-brass md:block"
            >
              {CONTACTS.phone}
            </a>
            <SocialLinks className="hidden xl:flex" size="sm" />

            <a
              href={CONTACTS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-brass px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-200 hover:bg-brass-light lg:block xl:hidden"
            >
              Написать в WhatsApp
            </a>

            <CartButton />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span
                className={`absolute h-0.5 w-6 rounded-full bg-bone transition-all duration-300 ease-drawer ${
                  open ? 'translate-y-0 rotate-45' : '-translate-y-2'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 rounded-full bg-bone transition-all duration-300 ease-drawer ${
                  open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 rounded-full bg-bone transition-all duration-300 ease-drawer ${
                  open ? 'translate-y-0 -rotate-45' : 'translate-y-2'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 h-full w-full cursor-default bg-ink/70 backdrop-blur-sm transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col justify-between overflow-y-auto border-l border-bone/10 bg-coal px-7 pb-8 pt-24 shadow-2xl transition-transform duration-500 ease-drawer ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col" aria-label="Мобильная навигация">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}
                className={`border-b border-bone/10 py-4 font-display text-2xl font-medium uppercase tracking-wide text-bone transition-all duration-500 ease-drawer hover:text-brass ${
                  open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div
            className="mt-8 border-t border-bone/10 pt-7 transition-all duration-500 ease-drawer"
            style={{ transitionDelay: open ? '450ms' : '0ms', opacity: open ? 1 : 0 }}
          >
            <a
              href={CONTACTS.phoneHref}
              className="block py-1.5 font-display text-2xl font-semibold text-bone transition-colors hover:text-brass"
            >
              {CONTACTS.phone}
            </a>
            <p className="mt-1 text-xs text-ash">Ежедневно · Краснодар и Волгоград</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <a
                href={CONTACTS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="rounded-full bg-brass py-3.5 text-center text-xs font-bold uppercase tracking-wider text-ink"
              >
                WhatsApp
              </a>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="rounded-full border border-bone/25 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-bone"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 1 — Первый экран
 * ------------------------------------------------------------------ */

function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const reveal = useStaggeredReveal(0.05)
  const isMobile = useIsMobile()

  const positions = useMaskPositions(sectionRef, cardRefs, 4)
  const layout = useMaskLayout(HERO_IMAGE, positions[0]?.sw ?? 0, positions[0]?.sh ?? 0, isMobile ? 0.62 : 0.5)

  const setCard = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el
  }

  return (
    <section
      id="top"
      ref={(el) => {
        sectionRef.current = el
        reveal.containerRef.current = el
      }}
      className="flex min-h-dvh-safe w-full flex-col gap-1.5 overflow-hidden px-3 pb-1.5 pt-[72px] md:h-dvh-safe md:min-h-[640px] md:gap-2 md:px-5 md:pb-2 md:pt-[92px]"
    >
      {/* Три факта */}
      <div className="grid shrink-0 grid-cols-1 gap-1.5 md:grid-cols-3 md:gap-2">
        {HERO_BARS.map((bar, i) => (
          <MaskedCard
            key={bar.title}
            bgImage={HERO_IMAGE}
            position={positions[i]}
            layout={layout}
            cardRef={setCard(i)}
            style={reveal.getAnimStyle(i)}
            className="relative h-[46px] overflow-hidden rounded-xl md:h-20 md:rounded-2xl"
          >
            <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-3 text-center">
              <span className="font-display text-sm font-semibold uppercase leading-tight tracking-wide text-bone md:text-base lg:text-xl">
                {bar.title}
              </span>
              <span className="mt-0.5 hidden text-[11px] leading-tight text-ash lg:block">{bar.note}</span>
            </div>
          </MaskedCard>
        ))}
      </div>

      {/* Главная карточка */}
      <MaskedCard
        bgImage={HERO_IMAGE}
        position={positions[3]}
        layout={layout}
        cardRef={setCard(3)}
        style={reveal.getAnimStyle(3)}
        className="relative min-h-[440px] w-full flex-1 overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/75 via-transparent to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col justify-between gap-6 p-4 md:p-8">
          <p className="max-w-[240px] text-xs font-semibold leading-5 text-bone sm:max-w-[320px] md:max-w-[420px] md:text-sm md:leading-6">
            Мы создаём изделия, которые хранят в себе дух истории, силу и красоту казачьей культуры.
          </p>

          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div className="min-w-0">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-brass md:mb-3 md:text-xs md:tracking-[0.24em]">
                Собственное производство · с 2022 года
              </span>
              <h1 className="font-display text-[clamp(2.5rem,10vw,9rem)] font-bold uppercase leading-[0.85] tracking-tight text-bone">
                Казачья
                <br />
                <span className="text-brass">Кузня</span>
              </h1>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center md:mt-8 md:gap-3">
                <PrimaryButton href="#catalog">Перейти в каталог</PrimaryButton>
                <GhostButton href="#production">Как мы куём</GhostButton>
              </div>
            </div>

            <div className="hidden shrink-0 pb-1 text-right lg:block">
              <span className="block font-display text-4xl font-bold leading-none text-bone">120+</span>
              <span className="mt-1 block max-w-[160px] text-[11px] leading-4 text-ash">
                изделий в каталоге: шашки, сабли, палаши, шпаги, кинжалы
              </span>
            </div>
          </div>
        </div>
      </MaskedCard>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 2 — Каталог
 * ------------------------------------------------------------------ */

function Catalog() {
  const reveal = useStaggeredReveal()

  return (
    <section
      id="catalog"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="w-full px-3 py-16 md:px-5 md:py-24"
    >
      <div className="mx-auto max-w-[1600px]">
        <div
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          style={reveal.getAnimStyle(0)}
        >
          <div>
            <SectionLabel index="01">Каталог</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] font-bold uppercase leading-[0.92] tracking-tight text-bone">
              Восемь направлений
              <br />
              <span className="text-brass">одной кузни</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-ash">
            От строевой донской шашки до вакидзаси. Каждое изделие — с цельнокованым хвостовиком, сквозным монтажом
            рукояти и сертификатом сувенирного изделия.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-1.5 md:mt-12 md:grid-cols-4 md:gap-2">
          {CATEGORIES.map((cat, i) => (
            <a
              key={cat.slug}
              href="#products"
              style={reveal.getAnimStyle(i + 1)}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-steel md:aspect-[4/5] md:rounded-2xl"
            >
              <img
                src={img(cat.image)}
                alt={cat.name}
                loading="lazy"
                decoding="async"
                width={900}
                height={1125}
                className="photo-tone absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-between p-3.5 md:p-5">
                <span className="self-end rounded-full border border-bone/25 bg-ink/40 px-2.5 py-1 text-[10px] font-semibold text-bone/80 backdrop-blur-sm md:text-xs">
                  {cat.count}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase leading-none tracking-wide text-bone md:text-3xl">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-4 text-ash md:text-xs md:leading-5">{cat.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brass md:text-xs">
                    Смотреть
                    <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 3 — Изделия
 * ------------------------------------------------------------------ */

function ProductCard({ product, style }: { product: (typeof PRODUCTS)[number]; style?: CSSProperties }) {
  const off = discount(product.price, product.oldPrice)
  return (
    <article
      style={style}
      className="group flex flex-col overflow-hidden rounded-xl border border-bone/10 bg-coal transition-colors duration-300 hover:border-brass/45 md:rounded-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-steel min-[420px]:aspect-square">
        <img
          src={img(product.image)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={860}
          height={860}
          className="photo-tone absolute inset-0 h-full w-full object-cover group-hover:scale-[1.05]"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5 md:left-3.5 md:top-3.5">
          {off > 0 && (
            <span className="rounded-full bg-brass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink md:text-xs">
              −{off}%
            </span>
          )}
          {product.tag && (
            <span className="rounded-full border border-bone/30 bg-ink/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-bone backdrop-blur-sm md:text-xs">
              {product.tag}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-3.5 md:p-5">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brass md:text-[11px]">
            {product.category} · {product.sku}
          </span>
          <h3 className="mt-2 text-sm font-bold leading-5 text-bone md:text-base md:leading-6">{product.name}</h3>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-xl font-bold leading-none text-bone md:text-2xl">
              {rub(product.price)}
            </span>
            <span className="text-xs text-ash line-through">{rub(product.oldPrice)}</span>
          </div>

          <div className="flex items-center gap-2">
            <AddToCartButton sku={product.sku} />
            <a
              href={`${CONTACTS.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Подскажите по изделию «${product.name}» (арт. ${product.sku}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Спросить в WhatsApp: ${product.name}`}
              title="Спросить в WhatsApp"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors duration-300 hover:border-brass hover:text-brass md:h-12 md:w-12"
            >
              <IconWhatsApp className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

function Products() {
  const reveal = useStaggeredReveal()
  const [filter, setFilter] = useState('Все')
  const [expanded, setExpanded] = useState(false)
  const STEP = 12

  const list = useMemo(
    () => (filter === 'Все' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  )
  const visible = expanded ? list : list.slice(0, STEP)
  const hidden = list.length - visible.length

  return (
    <section
      id="products"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="w-full border-t border-bone/10 bg-coal px-3 py-16 md:px-5 md:py-24"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between" style={reveal.getAnimStyle(0)}>
          <div>
            <SectionLabel index="02">Популярные изделия</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] font-bold uppercase leading-[0.92] tracking-tight text-bone">
              Что берут
              <br />
              <span className="text-brass">чаще всего</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-ash">
            Цены на сайте — действующие, со скидкой от базовой стоимости. По запросу делаем гравировку: имя, дату,
            посвящение или герб подразделения.
          </p>
        </div>

        {/* Фильтры */}
        <div
          className="no-scrollbar -mx-3 mt-8 flex gap-2 overflow-x-auto px-3 pb-1 md:mx-0 md:mt-12 md:flex-wrap md:px-0"
          style={reveal.getAnimStyle(1)}
          role="tablist"
          aria-label="Фильтр по категориям"
        >
          {PRODUCT_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => { setFilter(f); setExpanded(false) }}
              className={`shrink-0 rounded-full border px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 md:px-5 ${
                filter === f
                  ? 'border-brass bg-brass text-ink'
                  : 'border-bone/20 text-bone/70 hover:border-brass/60 hover:text-bone'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-1.5 min-[420px]:grid-cols-2 md:mt-8 md:gap-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={p.sku} product={p} style={reveal.getAnimStyle(Math.min(i, 8) + 2)} />
          ))}
        </div>

        {hidden > 0 && (
          <div className="mt-5 flex justify-center md:mt-8">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2.5 rounded-full border border-bone/25 px-7 py-4 text-sm font-bold uppercase tracking-wider text-bone transition-colors duration-300 hover:border-brass hover:text-brass"
            >
              Показать ещё {hidden}
            </button>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-bone/10 bg-steel p-6 text-center md:mt-10 md:flex-row md:justify-between md:rounded-2xl md:p-8 md:text-left">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-bone md:text-2xl">
              Не нашли нужное изделие?
            </h3>
            <p className="mt-1.5 text-sm text-ash">
              Изготовим под заказ за 2–3 недели — с вашими размерами, отделкой и гравировкой.
            </p>
          </div>
          <PrimaryButton href={CONTACTS.whatsapp} external className="shrink-0">
            Обсудить заказ
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 4 — Производство
 * ------------------------------------------------------------------ */

function Production() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const reveal = useStaggeredReveal(0.08)
  const isMobile = useIsMobile()

  const positions = useMaskPositions(sectionRef, cardRefs, 2)
  const layout = useMaskLayout(
    PRODUCTION_IMAGE,
    positions[0]?.sw ?? 0,
    positions[0]?.sh ?? 0,
    isMobile ? 0.55 : 0.35,
  )

  const setCard = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el
  }

  return (
    <section
      id="production"
      ref={(el) => {
        sectionRef.current = el
        reveal.containerRef.current = el
      }}
      className="w-full px-3 py-16 md:px-5 md:py-24"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 md:gap-2">
        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2">
          {/* Левая карточка — маска по общему фону */}
          <MaskedCard
            bgImage={PRODUCTION_IMAGE}
            position={positions[0]}
            layout={layout}
            cardRef={setCard(0)}
            style={reveal.getAnimStyle(0)}
            className="relative min-h-[340px] overflow-hidden rounded-xl md:min-h-[520px] md:rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 md:p-8">
              <SectionLabel index="03">Производство</SectionLabel>
              <div>
                <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight text-bone">
                  Мы гордимся
                  <br />
                  <span className="text-brass">своим цехом</span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-bone/80 md:text-base md:leading-7">
                  Все наши изделия изготавливаются на собственном производстве с использованием качественных материалов
                  и проверенных технологий. Это гарантирует не только эстетику, но и долговечность каждого предмета.
                </p>
              </div>
            </div>
          </MaskedCard>

          {/* Правая карточка — характеристики */}
          <div
            ref={setCard(1)}
            style={reveal.getAnimStyle(1)}
            className="flex min-h-[340px] flex-col justify-between rounded-xl border border-bone/10 bg-coal p-5 md:min-h-[520px] md:rounded-2xl md:p-8"
          >
            <div className="divide-y divide-bone/10">
              {SPECS.map((s) => (
                <div key={s.n} className="flex gap-4 py-4 first:pt-0 md:gap-6 md:py-5">
                  <span className="mt-0.5 font-display text-xs font-semibold text-brass md:text-sm">{s.n}</span>
                  <div>
                    <h3 className="font-display text-base font-semibold uppercase tracking-wide text-bone md:text-xl">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-ash md:text-sm md:leading-6">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-brass/25 bg-brass/[0.07] p-4 md:mt-8 md:p-5">
              <p className="text-xs leading-5 text-bone/85 md:text-sm md:leading-6">
                В соответствии с <strong className="font-bold text-brass">ГОСТ Р 51215-98</strong> продукция магазина не
                идентифицируется как холодное оружие. К каждому товару прилагается сертификат в бумажной и электронной
                версии — разрешение на ношение не требуется.
              </p>
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:gap-2 lg:grid-cols-5">
          {ADVANTAGES.map((a, i) => (
            <div
              key={a.title}
              style={reveal.getAnimStyle(i + 2)}
              className="group rounded-xl border border-bone/10 bg-coal p-5 transition-colors duration-300 hover:border-brass/40 md:rounded-2xl md:p-6"
            >
              <span className="font-display text-xs font-semibold text-brass">0{i + 1}</span>
              <h3 className="mt-3 font-display text-base font-semibold uppercase leading-tight tracking-wide text-bone md:text-lg">
                {a.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-ash md:text-sm">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 5 — Отзывы
 * ------------------------------------------------------------------ */

function Stars() {
  return (
    <span className="flex gap-0.5" aria-label="Оценка 5 из 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C8A25C" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
    </span>
  )
}

function Reviews() {
  const reveal = useStaggeredReveal()
  const trackRef = useRef<HTMLDivElement | null>(null)

  const slide = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    const step = card ? card.getBoundingClientRect().width + 8 : track.clientWidth * 0.8
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section
      id="reviews"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="w-full border-t border-bone/10 bg-coal py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1600px] px-3 md:px-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between" style={reveal.getAnimStyle(0)}>
          <div>
            <SectionLabel index="04">Отзывы</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] font-bold uppercase leading-[0.92] tracking-tight text-bone">
              Что говорят
              <br />
              <span className="text-brass">покупатели</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-bone/10 bg-steel px-5 py-4 md:rounded-2xl">
            <span className="font-display text-4xl font-bold leading-none text-brass">5,0</span>
            <div>
              <Stars />
              <p className="mt-1.5 text-xs text-ash">Средняя оценка покупателей</p>
            </div>

            <div className="ml-auto hidden gap-2 lg:flex">
              <button
                type="button"
                onClick={() => slide(-1)}
                aria-label="Предыдущий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors duration-300 hover:border-brass hover:text-brass"
              >
                <Arrow className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => slide(1)}
                aria-label="Следующий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors duration-300 hover:border-brass hover:text-brass"
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-3 pb-2 md:mt-12 md:gap-2 md:px-5"
        style={reveal.getAnimStyle(1)}
      >
        {REVIEWS.map((r) => (
          <figure
            key={r.name + r.item}
            className="flex w-[85vw] shrink-0 snap-start flex-col justify-between gap-5 rounded-xl border border-bone/10 bg-steel p-5 sm:w-[380px] md:rounded-2xl md:p-7"
          >
            <div>
              <Stars />
              <blockquote className="mt-4 text-sm leading-6 text-bone/90 md:text-base md:leading-7">
                «{r.text}»
              </blockquote>
            </div>
            <figcaption className="border-t border-bone/10 pt-4">
              <span className="block text-sm font-bold text-bone">{r.name}</span>
              <span className="mt-0.5 block text-xs text-ash">
                {r.item} · {r.date}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mx-auto mt-4 max-w-[1600px] px-3 text-xs text-ash md:px-5">
        Отзывы покупателей с профиля компании на Авито.
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 6 — Доставка и вопросы
 * ------------------------------------------------------------------ */

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="border-b border-bone/10">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-5 py-5 text-left md:py-6"
        >
          <span
            className={`font-display text-base font-semibold uppercase leading-tight tracking-wide transition-colors duration-300 md:text-xl ${
              open ? 'text-brass' : 'text-bone'
            }`}
          >
            {q}
          </span>
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:h-10 md:w-10 ${
              open ? 'rotate-45 border-brass text-brass' : 'border-bone/25 text-bone'
            }`}
            aria-hidden="true"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        className="grid transition-all duration-500 ease-smooth"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden" aria-hidden={!open}>
          <p className="max-w-3xl pb-5 pr-10 text-sm leading-6 text-ash md:pb-7 md:text-base md:leading-7">{a}</p>
        </div>
      </div>
    </div>
  )
}

function Faq() {
  const reveal = useStaggeredReveal()

  return (
    <section
      id="faq"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="w-full px-3 py-16 md:px-5 md:py-24"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div style={reveal.getAnimStyle(0)}>
          <SectionLabel index="05">Доставка и оплата</SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] font-bold uppercase leading-[0.92] tracking-tight text-bone">
            Частые
            <br />
            <span className="text-brass">вопросы</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-ash">
            Наши филиалы находятся рядом с Краснодаром и в Волгограде. Осуществляем отправку из этих городов по
            территории РФ и странам СНГ.
          </p>

          <div className="mt-7 flex flex-wrap gap-1.5 md:gap-2">
            {DELIVERY.map((d) => (
              <span
                key={d}
                className="rounded-full border border-bone/15 bg-coal px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bone/80"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="mt-7 rounded-xl border border-bone/10 bg-coal p-5 md:rounded-2xl md:p-6">
            <span className="font-display text-3xl font-bold leading-none text-brass md:text-4xl">2–3</span>
            <p className="mt-2 text-sm leading-6 text-ash">
              недели — средний срок изготовления, если изделия нет в наличии или нужны индивидуальные изменения.
            </p>
          </div>
        </div>

        <div style={reveal.getAnimStyle(1)}>
          {FAQ.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Секция 7 — Контакты
 * ------------------------------------------------------------------ */

function Contacts() {
  const reveal = useStaggeredReveal()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')

  const message = `Здравствуйте! Меня зовут ${name || '—'}. Телефон: ${phone || '—'}.${note ? ` ${note}` : ''}`
  const canSend = name.trim().length > 1 && phone.trim().length > 4

  return (
    <section
      id="contacts"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="w-full border-t border-bone/10 bg-coal px-3 py-16 md:px-5 md:py-24"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-1.5 md:gap-2 lg:grid-cols-2">
        {/* Контакты */}
        <div
          style={reveal.getAnimStyle(0)}
          className="flex flex-col justify-between rounded-xl border border-bone/10 bg-steel p-6 md:rounded-2xl md:p-9"
        >
          <div>
            <SectionLabel index="06">Контакты</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight text-bone">
              Остались
              <br />
              <span className="text-brass">вопросы?</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-ash">
              Напишите нам в Telegram или WhatsApp — ответим, подберём изделие под задачу и рассчитаем доставку.
            </p>
          </div>

          <div className="mt-8">
            <a
              href={CONTACTS.phoneHref}
              className="block py-2 font-display text-[clamp(1.75rem,5vw,3rem)] font-bold leading-none text-bone transition-colors hover:text-brass"
            >
              {CONTACTS.phone}
            </a>
            <a
              href={`mailto:${CONTACTS.email}`}
              className="mt-1 inline-block py-2.5 text-sm text-ash transition-colors hover:text-brass"
            >
              {CONTACTS.email}
            </a>

            <SocialLinks className="mt-6" />

            <p className="mt-6 max-w-sm text-xs leading-5 text-ash">
              Магазин-склад: ст. Северская, Краснодарский край. Производство: Волгоград.
            </p>
          </div>
        </div>

        {/* Форма */}
        <div
          style={reveal.getAnimStyle(1)}
          className="rounded-xl border border-bone/10 bg-steel p-6 md:rounded-2xl md:p-9"
        >
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-bone md:text-2xl">
            Заказать звонок
          </h3>
          <p className="mt-2 text-sm text-ash">Оставьте данные, и мы свяжемся с вами.</p>

          <form
            className="mt-7 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              window.open(`${CONTACTS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
            }}
          >
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Имя</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться"
                autoComplete="name"
                className="w-full rounded-xl border border-bone/15 bg-ink px-4 py-3.5 text-base text-bone outline-none transition-colors duration-200 placeholder:text-ash/60 focus:border-brass"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">Телефон</span>
              <input
                type="tel"
                required
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                autoComplete="tel"
                className="w-full rounded-xl border border-bone/15 bg-ink px-4 py-3.5 text-base text-bone outline-none transition-colors duration-200 placeholder:text-ash/60 focus:border-brass"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">
                Что вас интересует
              </span>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Например: шашка донская с гравировкой"
                className="w-full resize-none rounded-xl border border-bone/15 bg-ink px-4 py-3.5 text-base text-bone outline-none transition-colors duration-200 placeholder:text-ash/60 focus:border-brass"
              />
            </label>

            <button
              type="submit"
              disabled={!canSend}
              className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-brass px-6 py-4 text-sm font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-brass-light active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-bone/15 disabled:text-ash"
            >
              Отправить в WhatsApp
              <Arrow />
            </button>

            <p className="text-[11px] leading-4 text-ash">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Заявка откроется в WhatsApp — так мы
              отвечаем быстрее всего.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="w-full border-t border-bone/10 px-3 pb-28 pt-12 md:px-5 md:pt-16 lg:pb-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-bone md:text-3xl">
                Казачья
              </span>
              <span className="-mt-1 font-display text-2xl font-bold uppercase leading-none tracking-tight text-brass md:text-3xl">
                Кузня
              </span>
            </div>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ash">
              Традиции · Качество · Надёжность
            </p>
            <p className="mt-5 max-w-sm text-xs leading-5 text-ash">
              {CONTACTS.entity}
              <br />
              ОГРНИП: {CONTACTS.ogrnip}
              <br />
              ИНН: {CONTACTS.inn}
              <br />
              Адрес: {CONTACTS.address}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">Каталог</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <a href="#products" className="inline-block py-2.5 text-sm text-ash transition-colors hover:text-bone">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">Контакты</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a href={CONTACTS.phoneHref} className="inline-block py-2.5 text-sm font-bold text-bone transition-colors hover:text-brass">
                  {CONTACTS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACTS.email}`} className="inline-block py-2.5 text-sm text-ash transition-colors hover:text-bone">
                  {CONTACTS.email}
                </a>
              </li>
            </ul>

            <SocialLinks className="mt-5" size="sm" />
          </div>
        </div>

        <div className="mt-12 border-t border-bone/10 pt-7">
          <p className="max-w-4xl text-[11px] leading-5 text-ash/80">
            В соответствии с ГОСТ Р 51215-98 (холодное оружие) продукция данного интернет-магазина не идентифицируется
            как холодное оружие. Фото и видеоматериалы, представленные на сайте, являются материалами, описывающими
            сувенирные изделия. К каждому товару, имеющему внешний вид, напоминающий холодное оружие, прилагается
            сертификат в бумажной и электронной версии (заверенный государственными структурами), свидетельствующий о
            том, что данные товары являются сувенирными изделиями.
          </p>
          <p className="mt-5 text-[11px] text-ash/60">
            © {new Date().getFullYear()} Казачья Кузня. Копирование материалов сайта разрешается только с указанием
            ссылки на первоисточник.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ *
 * Мобильная панель действий
 * ------------------------------------------------------------------ */

function MobileActionBar() {
  const cart = useCart()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-bone/10 bg-ink/90 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-500 ease-smooth lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-2">
        <a
          href={CONTACTS.phoneHref}
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-bone/25 text-xs font-bold uppercase tracking-wider text-bone"
        >
          Позвонить
        </a>
        <a
          href={CONTACTS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-bone/25 text-bone"
        >
          <IconWhatsApp className="h-5 w-5" />
        </a>
        <button
          type="button"
          onClick={() => cart.setOpen(true)}
          className="relative flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brass text-xs font-bold uppercase tracking-wider text-ink"
        >
          <IconCart className="h-4 w-4" />
          Корзина
          {cart.count > 0 && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold tabular-nums text-brass">
              {cart.count}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * App
 * ------------------------------------------------------------------ */

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (!showSplash) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [showSplash])

  const onComplete = useCallback(() => setShowSplash(false), [])

  return (
    <CartProvider>
      <div className="bg-ink">
        {showSplash && <SplashScreen onComplete={onComplete} />}
        <Navbar />
        <main>
          <Hero />
          <Catalog />
          <Products />
          <Production />
          <Reviews />
          <Faq />
          <Contacts />
        </main>
        <Footer />
        <MobileActionBar />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
