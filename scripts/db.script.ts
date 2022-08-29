import { IArticle } from '@app/interfaces/article.interface';
import { createArticlesDataAccess } from '@app/models/article.model';
import mongoose from 'mongoose';

const seedDatabase = async () => {
    await mongoose.connect('mongodb://localhost');

    const articleRepository = createArticlesDataAccess();

    await articleRepository.deleteMany({});
    const article_npmBrokenByDesign: IArticle = {
        author: 'Dan Abramov',
        title: 'npm audit: Broken by Design',
        subtitle: 'Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)',
        body: [
            'Security is important. Nobody wants to be the person advocating for less security. So nobody wants to say it. But somebody has to say it.',
            'So I guess I’ll say it.',
            'The way npm audit works is broken. Its rollout as a default after every npm install was rushed, inconsiderate, and inadequate for the front-end tooling.',
            'Have you heard the story about the boy who cried wolf? Spoiler alert: the wolf eats the sheep. If we don’t want our sheep to be eaten, we need better tools.'
        ].join('\n')
    }

    const article_beforeYouMemo: IArticle = {
        author: 'Dan Abramov',
        title: 'Before You memo()',
        subtitle: 'Rendering optimizations that come naturally.',
        body: [
            'There are many articles written about React performance optimizations. In general, if some state update is slow, you need to:',
            '1. Verify you’re running a production build. (Development builds are intentionally slower, in extreme cases even by an order of magnitude.)',
            '2. Verify that you didn’t put the state higher in the tree than necessary. (For example, putting input state in a centralized store might not be the best idea.)',
            '3. Run React DevTools Profiler to see what gets re-rendered, and wrap the most expensive subtrees with memo(). (And add useMemo() where needed.)',
            'This last step is annoying, especially for components in between, and ideally a compiler would do it for you. In the future, it might.'
        ].join('\n')
    }

    const article_theWetCodebase: IArticle = {
        author: 'Matias Viñas',
        title: 'The WET Codebase',
        subtitle: 'Come waste your time with me.',
        body: [
            'There are many articles written about React performance optimizations. In general, if some state update is slow, you need to:',
            '1. Verify you’re running a production build. (Development builds are intentionally slower, in extreme cases even by an order of magnitude.)',
            '2. Verify that you didn’t put the state higher in the tree than necessary. (For example, putting input state in a centralized store might not be the best idea.)',
            '3. Run React DevTools Profiler to see what gets re-rendered, and wrap the most expensive subtrees with memo(). (And add useMemo() where needed.)',
            'This last step is annoying, especially for components in between, and ideally a compiler would do it for you. In the future, it might.'
        ].join('\n')
    }


    const promises = [
        articleRepository.create(article_npmBrokenByDesign),
        articleRepository.create(article_beforeYouMemo),
        articleRepository.create(article_theWetCodebase)
    ];

    await Promise.all(promises);
}

(async () => {
    try{
        await seedDatabase();
        console.log('Successs seeeding the database');
    } catch(error) {
        console.error(error);
    }

    await mongoose.disconnect()
})();