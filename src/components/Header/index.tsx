import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR'
import styles from './styles.module.scss';

export default function Header() {
	const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
		locale: ptBr,
	});

	return (
		<header className={styles.headerContainer}>
			<img src="/images/logo.svg" alt="Podcastr" />
			<p>O melhor para você escutar, sempre</p>
			<span>{currentDate}</span>
		</header>
	);
}
