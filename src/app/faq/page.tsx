import { getCachedFaqs } from '@/lib/data';
import FAQClient from './FAQClient';

export default async function FAQPage() {
    const faqs = await getCachedFaqs();

    return (
        <FAQClient initialFaqs={faqs} />
    );
}

